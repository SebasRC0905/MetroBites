const fs = require('fs/promises');
const path = require('path');

const pool =
require('../../config/database');
const bcrypt = require('bcrypt');

const {
    asegurarCorreoInstitucional,
    esContrasenaSegura,
    MENSAJE_CONTRASENA
} = require('../../utils/validaciones');

const limpiarTexto = (valor, limite) => {

    if (valor === undefined || valor === null) {
        return undefined;
    }

    const texto = String(valor).trim();

    return texto.length === 0 ? null : texto.slice(0, limite);
};

/**
 * Preferencias dietéticas del alumno (alergias y estilo de vida).
 * Se usan en el perfil y para avisarle si un platillo tiene un
 * alérgeno que él mismo registró.
 */
const getPreferenciasUsuario = async (userId) => {

    const [rows] = await pool.query(
        `
        SELECT
            pd.id,
            pd.nombre,
            pd.tipo
        FROM preferencias_usuario pu
        INNER JOIN preferencias_dieteticas pd
            ON pd.id = pu.preferencia_id
        WHERE pu.usuario_id = ?
        ORDER BY pd.tipo, pd.nombre
        `,
        [userId]
    );

    return rows;
};

/** Catálogo completo para pintar las opciones del perfil. */
const getCatalogoPreferencias = async () => {

    const [rows] = await pool.query(
        `
        SELECT id, nombre, tipo
        FROM preferencias_dieteticas
        ORDER BY tipo, nombre
        `
    );

    return rows;
};

const getProfile = async (
    userId
) => {

    const [rows] =
        await pool.query(
            `
            SELECT
                id,
                matricula,
                nombre,
                correo,
                carrera,
                url_foto,
                telefono,
                rol,
                tolerancia_picante,
                creado_en,
                actualizado_en
            FROM usuarios
            WHERE id = ?
            `,
            [userId]
        );

    if (rows.length === 0) {

        throw new Error(
            'Usuario no encontrado'
        );

    }

    const usuario = rows[0];

    usuario.preferencias = await getPreferenciasUsuario(userId);

    return usuario;

};

/**
 * Actualiza solo los campos que llegaron.
 *
 * Se arma la sentencia con los campos presentes en vez de exigir el
 * objeto completo: así la pantalla puede guardar el teléfono sin
 * mandar (ni arriesgarse a borrar) el resto del perfil.
 */
const updateProfile = async (
    userId,
    data
) => {

    const campos = [];
    const valores = [];

    const asignar = (columna, valor) => {

        if (valor === undefined) {
            return;
        }

        campos.push(`${columna} = ?`);
        valores.push(valor);
    };

    if (data.nombre !== undefined) {

        const nombre = limpiarTexto(data.nombre, 100);

        if (!nombre) {
            throw new Error('El nombre no puede quedar vacío');
        }

        asignar('nombre', nombre);

    }

    /* Carrera y teléfono sí se pueden dejar en blanco (quedan en NULL). */
    asignar('carrera', limpiarTexto(data.carrera, 100));
    asignar('telefono', limpiarTexto(data.telefono, 20));

    if (data.tolerancia_picante !== undefined) {

        const niveles = ['ninguno', 'medio', 'habanero'];

        if (!niveles.includes(data.tolerancia_picante)) {
            throw new Error('Nivel de picante no válido');
        }

        asignar('tolerancia_picante', data.tolerancia_picante);

    }

    if (campos.length > 0) {

        await pool.query(
            `
            UPDATE usuarios
            SET ${campos.join(', ')}
            WHERE id = ?
            `,
            [...valores, userId]
        );

    }

    if (Array.isArray(data.preferencias)) {

        await reemplazarPreferencias(userId, data.preferencias);

    }

    return getProfile(userId);

};

/**
 * Deja exactamente las preferencias que mandó el alumno: primero se
 * borran las suyas y luego se insertan las nuevas, dentro de una
 * transacción para que no quede a medias.
 */
const reemplazarPreferencias = async (userId, preferencias) => {

    const ids = [...new Set(
        preferencias
            .map((valor) => Number(valor))
            .filter((valor) => Number.isInteger(valor) && valor > 0)
    )];

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        await connection.query(
            `
            DELETE FROM preferencias_usuario
            WHERE usuario_id = ?
            `,
            [userId]
        );

        if (ids.length > 0) {

            const [validas] = await connection.query(
                `
                SELECT id
                FROM preferencias_dieteticas
                WHERE id IN (?)
                `,
                [ids]
            );

            if (validas.length > 0) {

                await connection.query(
                    `
                    INSERT INTO preferencias_usuario
                    (usuario_id, preferencia_id)
                    VALUES ?
                    `,
                    [validas.map((fila) => [userId, fila.id])]
                );

            }

        }

        await connection.commit();

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};

/**
 * Guarda la foto de perfil y borra la anterior del disco para no ir
 * acumulando archivos huérfanos en /uploads.
 */
const updateProfilePhoto = async (userId, urlFoto) => {

    const [rows] = await pool.query(
        `
        SELECT url_foto
        FROM usuarios
        WHERE id = ?
        `,
        [userId]
    );

    if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
    }

    const anterior = rows[0].url_foto;

    await pool.query(
        `
        UPDATE usuarios
        SET url_foto = ?
        WHERE id = ?
        `,
        [urlFoto, userId]
    );

    if (anterior && anterior !== urlFoto && anterior.startsWith('/uploads/')) {

        try {

            await fs.unlink(
                path.join(process.cwd(), anterior.replace(/^\//, ''))
            );

        } catch (error) {

            /*
             Que no exista el archivo viejo no es un problema: lo que
             importa es que la base ya apunta a la foto nueva.
            */
            if (error.code !== 'ENOENT') {
                console.error('No se pudo borrar la foto anterior:', error);
            }

        }

    }

    return getProfile(userId);

};

/** Cambio de contraseña del propio usuario. */
const changePassword = async (userId, actual, nueva) => {

    if (!esContrasenaSegura(nueva)) {
        throw new Error(MENSAJE_CONTRASENA);
    }

    const [rows] = await pool.query(
        `
        SELECT contrasena_hash
        FROM usuarios
        WHERE id = ?
        `,
        [userId]
    );

    if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
    }

    const coincide = await bcrypt.compare(
        String(actual || ''),
        rows[0].contrasena_hash
    );

    if (!coincide) {
        throw new Error('Tu contraseña actual no es correcta');
    }

    const hash = await bcrypt.hash(nueva, 10);

    await pool.query(
        `
        UPDATE usuarios
        SET contrasena_hash = ?
        WHERE id = ?
        `,
        [hash, userId]
    );

    return { message: 'Contraseña actualizada' };

};

const getAllUsersAdmin = async () => {

    const [rows] =
        await pool.query(
            `
            SELECT
                id,
                matricula,
                nombre,
                correo,
                carrera,
                url_foto,
                telefono,
                rol,
                tolerancia_picante,
                creado_en
            FROM usuarios
            ORDER BY creado_en DESC
            `
        );

    return rows;

};

const createUserAdmin = async (
    data
) => {

    const {
        matricula,
        nombre,
        password,
        carrera,
        rol,
        tolerancia_picante
    } = data;

    if (!password) {

        throw new Error(
            'La contraseña es requerida'
        );

    }

    /* El alta desde el panel exige el mismo correo institucional. */
    const correo = asegurarCorreoInstitucional(data.correo);

    const passwordHash =
        await bcrypt.hash(
            password,
            10
        );

    const [result] =
        await pool.query(
            `
            INSERT INTO usuarios
            (
                matricula,
                nombre,
                correo,
                contrasena_hash,
                carrera,
                rol,
                tolerancia_picante
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                matricula,
                nombre,
                correo,
                passwordHash,
                carrera,
                rol || 'alumno',
                tolerancia_picante || 'medio'
            ]
        );

    return {
        id: result.insertId
    };

};

const updateUserAdmin = async (
    id,
    data
) => {

    const {
        matricula,
        nombre,
        password,
        carrera,
        rol,
        tolerancia_picante
    } = data;

    const correo = asegurarCorreoInstitucional(data.correo);

    let result;

    if (password) {

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );

        [result] =
            await pool.query(
                `
                UPDATE usuarios
                SET
                    matricula = ?,
                    nombre = ?,
                    correo = ?,
                    contrasena_hash = ?,
                    carrera = ?,
                    rol = ?,
                    tolerancia_picante = ?
                WHERE id = ?
                `,
                [
                    matricula,
                    nombre,
                    correo,
                    passwordHash,
                    carrera,
                    rol,
                    tolerancia_picante,
                    id
                ]
            );

    } else {

        [result] =
            await pool.query(
                `
                UPDATE usuarios
                SET
                    matricula = ?,
                    nombre = ?,
                    correo = ?,
                    carrera = ?,
                    rol = ?,
                    tolerancia_picante = ?
                WHERE id = ?
                `,
                [
                    matricula,
                    nombre,
                    correo,
                    carrera,
                    rol,
                    tolerancia_picante,
                    id
                ]
            );

    }

    if (result.affectedRows === 0) {

        throw new Error(
            'Usuario no encontrado'
        );

    }

    return {
        message:
            'Usuario actualizado'
    };

};

const deleteUserAdmin = async (
    id
) => {

    let result;

    try {

        [result] =
            await pool.query(
                `
                DELETE FROM usuarios
                WHERE id = ?
                `,
                [id]
            );

    } catch (error) {

        if (
            error.code ===
            'ER_ROW_IS_REFERENCED_2'
        ) {

            throw new Error(
                'No se puede eliminar un usuario con pedidos registrados'
            );

        }

        throw error;

    }

    if (result.affectedRows === 0) {

        throw new Error(
            'Usuario no encontrado'
        );

    }

    return {
        message:
            'Usuario eliminado'
    };

};

module.exports = {
    getProfile,
    updateProfile,
    updateProfilePhoto,
    changePassword,
    getPreferenciasUsuario,
    getCatalogoPreferencias,
    getAllUsersAdmin,
    createUserAdmin,
    updateUserAdmin,
    deleteUserAdmin
};
