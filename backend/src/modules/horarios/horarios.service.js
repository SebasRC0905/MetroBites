const pool = require('../../config/database');

const getAllSchedules = async () => {

    const [rows] = await pool.query(`
        SELECT *
        FROM horarios_recoleccion
        WHERE activo = TRUE
        ORDER BY hora_inicio
    `);

    return rows;
};

module.exports = {
    getAllSchedules
};