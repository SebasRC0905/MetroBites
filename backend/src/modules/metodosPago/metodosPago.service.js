const pool = require('../../config/database');

const TIPOS_VALIDOS = [
    'tarjeta_credito',
    'tarjeta_debito',
    'paypal'
];

const getUserMethods = async (usuarioId) => {

    const [rows] = await pool.query(
        `
        SELECT
            id,
            tipo,
            alias,
            referencia,
            predeterminado
        FROM metodos_pago
        WHERE usuario_id = ?
        AND activo = 1
        ORDER BY predeterminado DESC, id DESC
        `,
        [usuarioId]
    );

    return rows;
};

/*
 Por seguridad, este proyecto nunca captura números de tarjeta ni CVV
 completos: `referencia` solo guarda una etiqueta que el propio
 usuario define (p. ej. "Terminación 4242" o su correo de PayPal).
 El cobro real siempre ocurre físicamente al recoger el pedido.
*/
const createMethod = async (usuarioId, data) => {

    const { tipo, alias, referencia, predeterminado } = data;

    if (!TIPOS_VALIDOS.includes(tipo)) {
        throw new Error('Tipo de método de pago inválido');
    }

    if (!referencia || !referencia.trim()) {
        throw new Error('Ingresa una referencia para identificar este método');
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        if (predeterminado) {
            await connection.query(
                `
                UPDATE metodos_pago
                SET predeterminado = 0
                WHERE usuario_id = ?
                `,
                [usuarioId]
            );
        }

        const [existentes] = await connection.query(
            `SELECT id FROM metodos_pago WHERE usuario_id = ? AND activo = 1`,
            [usuarioId]
        );

        const [result] = await connection.query(
            `
            INSERT INTO metodos_pago
            (
                usuario_id,
                tipo,
                alias,
                referencia,
                predeterminado
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                usuarioId,
                tipo,
                alias ? alias.trim() : null,
                referencia.trim(),
                predeterminado || existentes.length === 0 ? 1 : 0
            ]
        );

        await connection.commit();

        return {
            id: result.insertId
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};

const setDefaultMethod = async (usuarioId, id) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const [rows] = await connection.query(
            `SELECT id FROM metodos_pago WHERE id = ? AND usuario_id = ?`,
            [id, usuarioId]
        );

        if (rows.length === 0) {
            throw new Error('Método de pago no encontrado');
        }

        await connection.query(
            `UPDATE metodos_pago SET predeterminado = 0 WHERE usuario_id = ?`,
            [usuarioId]
        );

        await connection.query(
            `UPDATE metodos_pago SET predeterminado = 1 WHERE id = ?`,
            [id]
        );

        await connection.commit();

        return {
            message: 'Método actualizado como predeterminado'
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};

const deleteMethod = async (usuarioId, id) => {

    const [result] = await pool.query(
        `
        DELETE FROM metodos_pago
        WHERE id = ?
        AND usuario_id = ?
        `,
        [id, usuarioId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Método de pago no encontrado');
    }

    return {
        message: 'Método de pago eliminado'
    };

};

module.exports = {
    getUserMethods,
    createMethod,
    setDefaultMethod,
    deleteMethod
};
