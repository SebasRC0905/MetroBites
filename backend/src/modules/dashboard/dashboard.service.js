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

        SUM(
            CASE
                WHEN estado = 'pendiente_pago'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_pendiente_pago,

        SUM(
            CASE
                WHEN estado = 'confirmado'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_confirmados,

        SUM(
            CASE
                WHEN estado = 'rechazado'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_rechazados,

        SUM(
            CASE
                WHEN estado = 'no_recogido'
                THEN 1
                ELSE 0
            END
        ) AS pedidos_no_recogidos,

        COALESCE(
            SUM(total),
            0
        ) AS ventas_totales

        FROM pedidos
    `);

    return rows[0];
};
/**
 * Serie de los últimos 7 días para la gráfica de ventas del panel.
 * Se generan también los días sin pedidos para que la línea no tenga
 * huecos.
 */
const getSalesByDay = async (dias = 7) => {

    const total = Math.min(Math.max(Number(dias) || 7, 1), 30);

    const [rows] =
        await pool.query(
            `
            SELECT
                DATE(creado_en) AS dia,
                COUNT(*) AS pedidos,
                COALESCE(SUM(total), 0) AS ingresos
            FROM pedidos
            WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY DATE(creado_en)
            ORDER BY dia ASC
            `,
            [total - 1]
        );

    const porDia = new Map();

    for (const fila of rows) {

        const clave =
            fila.dia instanceof Date
                ? fila.dia.toISOString().slice(0, 10)
                : String(fila.dia).slice(0, 10);

        porDia.set(clave, {
            pedidos: Number(fila.pedidos),
            ingresos: Number(fila.ingresos)
        });

    }

    const serie = [];

    for (let i = total - 1; i >= 0; i -= 1) {

        const fecha = new Date();

        fecha.setHours(0, 0, 0, 0);
        fecha.setDate(fecha.getDate() - i);

        const clave = fecha.toISOString().slice(0, 10);

        serie.push({
            dia: clave,
            pedidos: porDia.get(clave)?.pedidos || 0,
            ingresos: porDia.get(clave)?.ingresos || 0
        });

    }

    return serie;
};
/**
 * Distribución de pedidos por hora del día: sirve para saber en qué
 * receso se satura la cafetería.
 */
const getOrdersByHour = async () => {

    const [rows] =
        await pool.query(
            `
            SELECT
                HOUR(creado_en) AS hora,
                COUNT(*) AS pedidos
            FROM pedidos
            GROUP BY HOUR(creado_en)
            ORDER BY hora ASC
            `
        );

    return rows.map((fila) => ({
        hora: Number(fila.hora),
        etiqueta: `${String(fila.hora).padStart(2, '0')}:00`,
        pedidos: Number(fila.pedidos)
    }));
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
    getTodaySales,
    getSalesByDay,
    getOrdersByHour
};