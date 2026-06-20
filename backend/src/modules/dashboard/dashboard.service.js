const pool = require('../../config/database');

const getSummary = async () => {

    const [rows] = await pool.query(`
        SELECT

        SUM(
            CASE
                WHEN estado = 'recibido'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_recibidos,

        SUM(
            CASE
                WHEN estado = 'preparando'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_preparando,

        SUM(
            CASE
                WHEN estado = 'listo'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_listos,

        SUM(
            CASE
                WHEN estado = 'entregado'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_entregados,

        SUM(
            CASE
                WHEN estado = 'cancelado'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_cancelados,

        COALESCE(
            SUM(total),
            0
        ) AS ventas_totales

        FROM pedidos
    `);

    return rows[0];
};
const getTopProducts = async () => {

    const [rows] =
        await pool.query(
            `
            SELECT
                p.nombre AS producto,

                SUM(
                    dp.cantidad
                ) AS ventas

            FROM detalles_pedido dp

            INNER JOIN productos p
                ON dp.producto_id = p.id

            GROUP BY
                p.id,
                p.nombre

            ORDER BY ventas DESC

            LIMIT 10
            `
        );

    return rows;
};
const getTodaySales = async () => {

    const [rows] =
        await pool.query(
            `
            SELECT

                COUNT(*) AS pedidos_hoy,

                COALESCE(
                    SUM(total),
                    0
                ) AS ingresos_hoy

            FROM pedidos

            WHERE DATE(creado_en)
                = CURDATE()
            `
        );

    return rows[0];
};
module.exports = {
    getSummary,
    getTopProducts,
    getTodaySales
};