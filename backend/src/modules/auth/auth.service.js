const pool = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {

    const {
        matricula,
        nombre,
        correo,
        password,
        carrera,
        tolerancia_picante
    } = userData;

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        `
        INSERT INTO usuarios (
            matricula,
            nombre,
            correo,
            contrasena_hash,
            carrera,
            tolerancia_picante
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            matricula,
            nombre,
            correo,
            passwordHash,
            carrera,
            tolerancia_picante
        ]
    );

    return result;
};

const loginUser = async (correo, password) => {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM usuarios
        WHERE correo = ?
        `,
        [correo]
    );

    if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
    }

    const usuario = rows[0];

    const passwordValida = await bcrypt.compare(
        password,
        usuario.contrasena_hash
    );

    if (!passwordValida) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h'
        }
    );

    return {
        token,
        usuario: {
            id: usuario.id,
            matricula: usuario.matricula,
            nombre: usuario.nombre,
            correo: usuario.correo,
            carrera: usuario.carrera,
            rol: usuario.rol
        }
    };
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
                rol,
                tolerancia_picante
            FROM usuarios
            WHERE id = ?
            `,
            [userId]
        );

    if (
        rows.length === 0
    ) {

        throw new Error(
            'Usuario no encontrado'
        );

    }

    return rows[0];

};
module.exports = {
    registerUser,
    loginUser,
    getProfile
};