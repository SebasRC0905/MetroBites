const pool =
require('../../config/database');

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

module.exports = {
    getProfile,
    updateProfile
};