const pool = require('../../config/database');

const getFavorites = async (usuarioId) => {

    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.nombre,
            p.descripcion,
            p.precio_base,
            p.url_imagen
        FROM favoritos f
        INNER JOIN productos p
            ON f.producto_id = p.id
        WHERE f.usuario_id = ?
    `, [usuarioId]);

    return rows;
};

const addFavorite = async (
    usuarioId,
    productoId
) => {

    const [result] = await pool.query(`
        INSERT INTO favoritos
        (
            usuario_id,
            producto_id
        )
        VALUES (?, ?)
    `, [
        usuarioId,
        productoId
    ]);

    return result;
};

const removeFavorite = async (
    usuarioId,
    productoId
) => {

    const [result] = await pool.query(`
        DELETE FROM favoritos
        WHERE usuario_id = ?
        AND producto_id = ?
    `, [
        usuarioId,
        productoId
    ]);

    return result;
};

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite
};