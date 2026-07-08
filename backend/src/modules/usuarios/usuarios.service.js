const pool =
require('../../config/database');
const bcrypt = require('bcrypt');

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
                rol,
                tolerancia_picante
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

    return rows[0];

};

const updateProfile = async (
    userId,
    data
) => {

    const {
        tolerancia_picante
    } = data;

    await pool.query(
        `
        UPDATE usuarios
        SET tolerancia_picante = ?
        WHERE id = ?
        `,
        [
            tolerancia_picante,
            userId
        ]
    );

    return {
        message:
            'Perfil actualizado'
    };

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
        correo,
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
        correo,
        password,
        carrera,
        rol,
        tolerancia_picante
    } = data;

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
    getAllUsersAdmin,
    createUserAdmin,
    updateUserAdmin,
    deleteUserAdmin
};
