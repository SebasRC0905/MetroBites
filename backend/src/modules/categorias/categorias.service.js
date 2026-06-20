const pool = require('../../config/database');

const getAllCategories = async () => {

    const [rows] = await pool.query(`
        SELECT *
        FROM categorias
        ORDER BY nombre
    `);

    return rows;
};

module.exports = {
    getAllCategories
};