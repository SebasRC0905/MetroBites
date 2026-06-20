const pool = require('../../config/database');

const createOrder = async (
    usuarioId,
    orderData
) => {

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        const {
            horario_id,
            metodo_pago,
            productos
        } = orderData;

        /*
         Validar que el pedido
         tenga productos
        */
        if (
            !productos ||
            productos.length === 0
        ) {

            throw new Error(
                'El pedido no contiene productos'
            );

        }

        /*
         Validar horario
        */
        const [horarioRows] =
            await connection.query(
                `
                SELECT *
                FROM horarios_recoleccion
                WHERE id = ?
                `,
                [horario_id]
            );

        if (
            horarioRows.length === 0
        ) {

            throw new Error(
                'Horario de recolección inválido'
            );

        }

        let totalPedido = 0;

        const detallesProcesados = [];

        for (const item of productos) {
            if (
                !item.cantidad ||
                item.cantidad <= 0
            ) {

                throw new Error(
                    `Cantidad inválida para el producto ${item.producto_id}`
                );

            }

            const [productoRows] =
                await connection.query(
                    `
                    SELECT *
                    FROM productos
                    WHERE id = ?
                    `,
                    [item.producto_id]
                );

            if (productoRows.length === 0) {
                throw new Error(
                    `Producto ${item.producto_id} no existe`
                );
            }

            const producto =
                productoRows[0];

            let subtotal =
                Number(producto.precio_base);

            const personalizacionesData = [];

            if (
                item.personalizaciones &&
                item.personalizaciones.length > 0
            ) {

                for (const personalizacionId of item.personalizaciones) {

                    const [personalizacionRows] =
                        await connection.query(
                            `
                            SELECT *
                            FROM personalizaciones_producto
                            WHERE id = ?
                            `,
                            [personalizacionId]
                        );

                    if (
                        personalizacionRows.length === 0
                    ) {

                        throw new Error(
                            `La personalización con ID ${personalizacionId} no existe`
                        );

                    }

                    const personalizacion =
                        personalizacionRows[0];

                    /*
                     Validar que la personalización
                     pertenezca al producto solicitado
                    */
                    if (
                        personalizacion.producto_id !==
                        item.producto_id
                    ) {

                        throw new Error(
                            `La personalización ${personalizacion.nombre}
                            no pertenece al producto ${item.producto_id}`
                        );

                    }

                    subtotal += Number(
                        personalizacion.precio_adicional
                    );

                    personalizacionesData.push(
                        personalizacion
                    );
                }
            }

            subtotal *= item.cantidad;

            totalPedido += subtotal;

            detallesProcesados.push({
                producto,
                cantidad: item.cantidad,
                subtotal,
                personalizaciones:
                    personalizacionesData
            });
        }

        const codigoQR =
            `MB-${Date.now()}`;

        const [pedidoResult] =
            await connection.query(
                `
                INSERT INTO pedidos
                (
                    usuario_id,
                    horario_id,
                    estado,
                    estado_pago,
                    total,
                    metodo_pago,
                    codigo_qr
                )
                VALUES
                (?, ?, 'recibido', 'pendiente', ?, ?, ?)
                `,
                [
                    usuarioId,
                    horario_id,
                    totalPedido,
                    metodo_pago,
                    codigoQR
                ]
            );

        const pedidoId =
            pedidoResult.insertId;

        for (const detalle of detallesProcesados) {

            const [detalleResult] =
                await connection.query(
                    `
                    INSERT INTO detalles_pedido
                    (
                        pedido_id,
                        producto_id,
                        cantidad,
                        precio_unitario,
                        subtotal
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,
                    [
                        pedidoId,
                        detalle.producto.id,
                        detalle.cantidad,
                        detalle.producto.precio_base,
                        detalle.subtotal
                    ]
                );

            const detallePedidoId =
                detalleResult.insertId;
            for (
                const personalizacion
                of detalle.personalizaciones
            ) {

                await connection.query(
                    `
                    INSERT INTO
                    personalizaciones_detalle_pedido
                    (
                        detalle_pedido_id,
                        nombre_personalizacion,
                        precio_personalizacion
                    )
                    VALUES (?, ?, ?)
                    `,
                    [
                        detallePedidoId,
                        personalizacion.nombre,
                        personalizacion.precio_adicional
                    ]
                );
            }
        }

        await connection.commit();

        return {
            pedidoId,
            totalPedido,
            codigoQR
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
};
const getUserOrders = async (
    usuarioId
) => {

    const [rows] =
        await pool.query(
            `
            SELECT
                id,
                estado,
                estado_pago,
                total,
                metodo_pago,
                codigo_qr,
                creado_en
            FROM pedidos
            WHERE usuario_id = ?
            ORDER BY creado_en DESC
            `,
            [usuarioId]
        );

    return rows;
};
const getOrderById = async (
    pedidoId,
    usuarioId
) => {

    const [pedidoRows] =
        await pool.query(
            `
            SELECT
                id,
                estado,
                estado_pago,
                total,
                metodo_pago,
                codigo_qr,
                creado_en
            FROM pedidos
            WHERE id = ?
            AND usuario_id = ?
            `,
            [
                pedidoId,
                usuarioId
            ]
        );

    if (
        pedidoRows.length === 0
    ) {

        throw new Error(
            'Pedido no encontrado'
        );

    }

    const pedido =
        pedidoRows[0];

    const [detalles] =
        await pool.query(
            `
            SELECT
                dp.id,
                p.nombre,
                dp.cantidad,
                dp.precio_unitario,
                dp.subtotal
            FROM detalles_pedido dp
            INNER JOIN productos p
                ON dp.producto_id = p.id
            WHERE dp.pedido_id = ?
            `,
            [pedidoId]
        );

    for (
        const detalle
        of detalles
    ) {

        const [personalizaciones] =
            await pool.query(
                `
                SELECT
                    nombre_personalizacion,
                    precio_personalizacion
                FROM personalizaciones_detalle_pedido
                WHERE detalle_pedido_id = ?
                `,
                [detalle.id]
            );

        detalle.personalizaciones =
            personalizaciones;
    }

    pedido.productos =
        detalles;

    return pedido;
};
const getAllOrders = async () => {

    const [rows] =
        await pool.query(
            `
            SELECT
                p.id,
                u.nombre AS cliente,
                u.matricula,
                p.estado,
                p.estado_pago,
                p.total,
                p.metodo_pago,
                p.codigo_qr,
                p.creado_en
            FROM pedidos p
            INNER JOIN usuarios u
                ON p.usuario_id = u.id
            ORDER BY p.creado_en DESC
            `
        );

    return rows;
};
const updateOrderStatus = async (
    pedidoId,
    nuevoEstado
) => {

    const estadosValidos = [
        'recibido',
        'preparando',
        'listo',
        'entregado',
        'cancelado'
    ];

    if (
        !estadosValidos.includes(
            nuevoEstado
        )
    ) {

        throw new Error(
            'Estado inválido'
        );

    }

    const [pedidoRows] =
        await pool.query(
            `
            SELECT *
            FROM pedidos
            WHERE id = ?
            `,
            [pedidoId]
        );

    if (
        pedidoRows.length === 0
    ) {

        throw new Error(
            'Pedido no encontrado'
        );

    }

    const pedido =
        pedidoRows[0];

    const transiciones = {

        recibido: [
            'preparando',
            'cancelado'
        ],

        preparando: [
            'listo',
            'cancelado'
        ],

        listo: [
            'entregado'
        ],

        entregado: [],

        cancelado: []
    };

    if (
        !transiciones[
            pedido.estado
        ].includes(
            nuevoEstado
        )
    ) {

        throw new Error(
            `No se puede cambiar de ${pedido.estado} a ${nuevoEstado}`
        );

    }

    await pool.query(
        `
        UPDATE pedidos
        SET estado = ?
        WHERE id = ?
        `,
        [
            nuevoEstado,
            pedidoId
        ]
    );

    return {
        pedidoId,
        estadoAnterior:
            pedido.estado,
        estadoNuevo:
            nuevoEstado
    };
};
module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};