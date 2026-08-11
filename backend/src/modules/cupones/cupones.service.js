const pool = require('../../config/database');

const getAllCoupons = async () => {

    const [rows] = await pool.query(`
        SELECT
            id,
            codigo,
            monto_descuento,
            compra_minima,
            valido_hasta
        FROM cupones
        ORDER BY id DESC
    `);

    return rows;
};

const createCoupon = async (data) => {

    const {
        codigo,
        monto_descuento,
        compra_minima,
        valido_hasta
    } = data;

    if (!codigo || !codigo.trim()) {
        throw new Error('El código del cupón es requerido');
    }

    if (!monto_descuento || Number(monto_descuento) <= 0) {
        throw new Error('El descuento debe ser mayor a cero');
    }

    const codigoNormalizado = codigo.trim().toUpperCase();

    const [existentes] = await pool.query(
        `SELECT id FROM cupones WHERE codigo = ?`,
        [codigoNormalizado]
    );

    if (existentes.length > 0) {
        throw new Error('Ya existe un cupón con ese código');
    }

    const [result] = await pool.query(
        `
        INSERT INTO cupones
        (
            codigo,
            monto_descuento,
            compra_minima,
            valido_hasta
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            codigoNormalizado,
            Number(monto_descuento),
            compra_minima ? Number(compra_minima) : 0,
            valido_hasta || null
        ]
    );

    return {
        id: result.insertId
    };
};

const deleteCoupon = async (id) => {

    const [result] = await pool.query(
        `DELETE FROM cupones WHERE id = ?`,
        [id]
    );

    if (result.affectedRows === 0) {
        throw new Error('Cupón no encontrado');
    }

    return {
        message: 'Cupón eliminado'
    };
};

/*
 Valida un cupón contra el subtotal actual del carrito. No aplica el
 descuento por sí sola: solo confirma si es utilizable y calcula el
 monto, dejando que quien llame decida qué hacer con el resultado
 (el checkout lo vuelve a validar al crear el pedido).
*/
const validateCoupon = async (codigo, subtotal) => {

    if (!codigo || !codigo.trim()) {
        throw new Error('Ingresa un código de cupón');
    }

    const [rows] = await pool.query(
        `SELECT * FROM cupones WHERE codigo = ?`,
        [codigo.trim().toUpperCase()]
    );

    if (rows.length === 0) {
        throw new Error('El cupón no existe');
    }

    const cupon = rows[0];

    if (cupon.valido_hasta) {

        const hoy = new Date();
        const vencimiento = new Date(cupon.valido_hasta);

        hoy.setHours(0, 0, 0, 0);
        vencimiento.setHours(0, 0, 0, 0);

        if (vencimiento < hoy) {
            throw new Error('El cupón ya venció');
        }

    }

    if (Number(subtotal) < Number(cupon.compra_minima)) {
        throw new Error(
            `Compra mínima de $${Number(cupon.compra_minima).toFixed(2)} para usar este cupón`
        );
    }

    const descuento = Math.min(
        Number(cupon.monto_descuento),
        Number(subtotal)
    );

    return {
        id: cupon.id,
        codigo: cupon.codigo,
        descuento,
        total: Number(subtotal) - descuento
    };
};

module.exports = {
    getAllCoupons,
    createCoupon,
    deleteCoupon,
    validateCoupon
};
