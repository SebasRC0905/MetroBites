const pool = require('../../config/database');

const getAllProducts = async () => {

    const [rows] = await pool.query(`
        SELECT
            p.id,
            p.categoria_id,
            p.nombre,
            p.descripcion,
            p.precio_base,
            p.url_imagen,
            p.disponible,
            c.nombre AS categoria,
            (
                SELECT COUNT(*)
                FROM personalizaciones_producto pp
                WHERE pp.producto_id = p.id
            ) AS total_personalizaciones,
            (
                SELECT COUNT(*)
                FROM personalizaciones_producto pp
                WHERE pp.producto_id = p.id
                AND pp.min_selecciones > 0
            ) AS personalizaciones_requeridas
        FROM productos p
        INNER JOIN categorias c
            ON p.categoria_id = c.id
        WHERE p.disponible = TRUE
        ORDER BY p.nombre
    `);

    return rows;
};

/*
 Las personalizaciones se guardan como opciones sueltas con la
 configuración del grupo repetida en cada fila. Aquí se leen siempre
 con las mismas columnas y en el mismo orden para que el frontend
 pueda armar los grupos (única/múltiple, mínimos y máximos).
*/
const obtenerPersonalizaciones = async (productoId) => {

    const [personalizaciones] = await pool.query(
        `
        SELECT
            id,
            nombre,
            descripcion,
            precio_adicional,
            es_requerido,
            nombre_grupo,
            tipo_grupo,
            min_selecciones,
            max_selecciones,
            orden,
            orden_opcion
        FROM personalizaciones_producto
        WHERE producto_id = ?
        ORDER BY orden, nombre_grupo, orden_opcion, id
        `,
        [productoId]
    );

    return personalizaciones;
};

/**
 * Copia la plantilla de personalización de una categoría a un producto
 * recién creado. Así un refresco nace con "Tamaño / Temperatura" y una
 * torta con "Tipo de pan / Salsa", sin capturar nada a mano.
 */
const aplicarPlantillaCategoria = async (
    productoId,
    categoriaId
) => {

    await pool.query(
        `
        INSERT INTO personalizaciones_producto
        (
            producto_id,
            nombre,
            precio_adicional,
            es_requerido,
            nombre_grupo,
            tipo_grupo,
            min_selecciones,
            max_selecciones,
            orden,
            orden_opcion,
            descripcion
        )
        SELECT
            ?,
            t.nombre,
            t.precio_adicional,
            t.es_requerido,
            t.nombre_grupo,
            t.tipo_grupo,
            t.min_selecciones,
            t.max_selecciones,
            t.orden,
            t.orden_opcion,
            t.descripcion
        FROM plantillas_personalizacion t
        LEFT JOIN personalizaciones_producto pp
            ON pp.producto_id = ?
            AND pp.nombre_grupo = t.nombre_grupo
            AND pp.nombre = t.nombre
        WHERE t.categoria_id = ?
        AND pp.id IS NULL
        `,
        [productoId, productoId, categoriaId]
    );

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

    const personalizaciones =
        await obtenerPersonalizaciones(id);

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
            p.categoria_id,
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

    const personalizaciones =
        await obtenerPersonalizaciones(id);

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

    /*
     El producto nace con las opciones típicas de su categoría; el
     administrador puede ajustarlas después.
    */
    await aplicarPlantillaCategoria(
        result.insertId,
        categoria_id
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
            p.categoria_id,
            p.nombre,
            p.descripcion,
            p.precio_base,
            p.stock,
            p.url_imagen,
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
    obtenerPersonalizaciones,
    aplicarPlantillaCategoria,
    getProductById,
    getProductsByCategory,
    getProductDetail,
    createProduct,
    updateProduct,
    toggleAvailability,
    getAllProductsAdmin
};