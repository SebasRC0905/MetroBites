const pool = require('../../config/database');

const getAllProducts = async () => {

    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.nombre,
            p.descripcion,
            p.precio_base,
            p.url_imagen,
            p.disponible,
            c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c
            ON p.categoria_id = c.id
        WHERE p.disponible = TRUE
        ORDER BY p.nombre
    `);

    return rows;
};

const getProductById = async (id) => {

    const [productRows] =
        await pool.query(
            `
            SELECT *
            FROM productos
            WHERE id = ?
            `,
            [id]
        );

    if (
        productRows.length === 0
    ) {

        return null;

    }

    const producto =
        productRows[0];

    const [personalizaciones] =
        await pool.query(
            `
            SELECT
                id,
                nombre,
                precio_adicional,
                es_requerido,
                nombre_grupo
            FROM personalizaciones_producto
            WHERE producto_id = ?
            ORDER BY nombre_grupo
            `,
            [id]
        );

    return {
        producto,
        personalizaciones
    };
};

const getProductsByCategory = async (categoriaId) => {

    const [rows] = await pool.query(`
        SELECT *
        FROM productos
        WHERE categoria_id = ?
        AND disponible = TRUE
    `, [categoriaId]);

    return rows;
};

const getProductDetail = async (id) => {

    const [productoRows] = await pool.query(`
        SELECT
            p.id,
            p.nombre,
            p.descripcion,
            p.precio_base,
            p.url_imagen,
            p.disponible,
            c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c
            ON p.categoria_id = c.id
        WHERE p.id = ?
    `, [id]);

    if (productoRows.length === 0) {
        return null;
    }

    const [personalizaciones] = await pool.query(`
        SELECT
            id,
            nombre,
            precio_adicional,
            es_requerido,
            nombre_grupo
        FROM personalizaciones_producto
        WHERE producto_id = ?
        ORDER BY nombre_grupo, nombre
    `, [id]);

    return {
        ...productoRows[0],
        personalizaciones
    };
};
const createProduct = async (
    data
) => {

    const {
        categoria_id,
        nombre,
        descripcion,
        precio_base,
        stock,
        url_imagen
    } = data;

    const [result] =
        await pool.query(
            `
            INSERT INTO productos (
                categoria_id,
                nombre,
                descripcion,
                precio_base,
                stock,
                url_imagen
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                categoria_id,
                nombre,
                descripcion,
                precio_base,
                stock,
                url_imagen
            ]
        );

    return {
        id: result.insertId
    };

};

const updateProduct = async (
    id,
    data
) => {

    const {
        categoria_id,
        nombre,
        descripcion,
        precio_base,
        stock,
        url_imagen
    } = data;

    await pool.query(
        `
        UPDATE productos
        SET
            categoria_id = ?,
            nombre = ?,
            descripcion = ?,
            precio_base = ?,
            stock = ?,
            url_imagen = ?
        WHERE id = ?
        `,
        [
            categoria_id,
            nombre,
            descripcion,
            precio_base,
            stock,
            url_imagen,
            id
        ]
    );

    return {
        message:
            'Producto actualizado'
    };

};

const toggleAvailability = async (
    id,
    disponible
) => {

    await pool.query(
        `
        UPDATE productos
        SET disponible = ?
        WHERE id = ?
        `,
        [
            disponible,
            id
        ]
    );

    return {
        message:
            'Disponibilidad actualizada'
    };

};
const getAllProductsAdmin =
async () => {

    const [rows] =
        await pool.query(`
            SELECT
                p.id,
                p.nombre,
                p.descripcion,
                p.precio_base,
                p.stock,
                p.disponible,
                c.nombre AS categoria
            FROM productos p
            INNER JOIN categorias c
                ON p.categoria_id = c.id
            ORDER BY p.nombre
        `);

    return rows;

};
module.exports = {  
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductDetail,
    createProduct,
    updateProduct,
    toggleAvailability,
    getAllProductsAdmin
};