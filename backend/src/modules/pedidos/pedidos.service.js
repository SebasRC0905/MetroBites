const pool = require('../../config/database');

const eventBus = require('../../realtime/eventBus');

const {
    ESTADOS,
    REQUIEREN_MOTIVO,
    TIEMPO_ESTIMADO_POR_ESTADO,
    ESTADO_PAGO_POR_ESTADO,
    ESTADOS_ACTIVOS,
    existeEstado,
    puedeTransicionar,
    obtenerTransiciones
} = require('./pedidos.estados');

/*
 Pagos que se cobran en ventanilla al recoger: el pedido entra directo
 como "recibido". Los demás métodos nacen en "pendiente_pago" hasta que
 se confirma el cobro.
*/
const PAGOS_EN_VENTANILLA = ['efectivo'];

const limpiarNota = (valor, limite = 255) => {

    if (typeof valor !== 'string') {
        return null;
    }

    const texto = valor.trim();

    if (texto.length === 0) {
        return null;
    }

    return texto.slice(0, limite);
};

/**
 * Registra el cambio en la bitácora y avisa por SSE a las pantallas
 * conectadas. Se usa tanto al crear el pedido como en cada transición.
 */
const registrarCambioEstado = async (
    connection,
    {
        pedidoId,
        estadoAnterior,
        estadoNuevo,
        usuarioId,
        nota
    }
) => {

    await connection.query(
        `
        INSERT INTO historial_estados_pedido
        (
            pedido_id,
            estado_anterior,
            estado_nuevo,
            usuario_id,
            nota
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            pedidoId,
            estadoAnterior,
            estadoNuevo,
            usuarioId || null,
            limpiarNota(nota)
        ]
    );

};

/**
 * Agrupa las personalizaciones de un producto y valida la selección del
 * alumno contra las reglas del grupo (única/múltiple, mínimos, máximos).
 * Aquí es donde "la personalización depende del tipo de comida": los
 * grupos vienen de la plantilla de la categoría del producto.
 */
const validarPersonalizaciones = (
    producto,
    opcionesDisponibles,
    idsSeleccionados
) => {

    const grupos = new Map();

    for (const opcion of opcionesDisponibles) {

        const nombreGrupo = opcion.nombre_grupo || 'Extras';

        if (!grupos.has(nombreGrupo)) {

            grupos.set(nombreGrupo, {
                nombre: nombreGrupo,
                tipo: opcion.tipo_grupo || 'multiple',
                minimo: Number(opcion.min_selecciones || 0),
                maximo:
                    opcion.max_selecciones === null ||
                    opcion.max_selecciones === undefined
                        ? null
                        : Number(opcion.max_selecciones),
                opciones: []
            });

        }

        grupos.get(nombreGrupo).opciones.push(opcion);

    }

    const seleccionadas = [];

    for (const id of idsSeleccionados) {

        const opcion = opcionesDisponibles.find(
            (item) => item.id === Number(id)
        );

        if (!opcion) {

            throw new Error(
                `La personalización ${id} no pertenece a ${producto.nombre}`
            );

        }

        if (seleccionadas.some((item) => item.id === opcion.id)) {
            continue;
        }

        seleccionadas.push(opcion);

    }

    for (const grupo of grupos.values()) {

        const elegidasDelGrupo = seleccionadas.filter(
            (opcion) => (opcion.nombre_grupo || 'Extras') === grupo.nombre
        );

        const maximo =
            grupo.tipo === 'unica'
                ? 1
                : grupo.maximo;

        if (elegidasDelGrupo.length < grupo.minimo) {

            throw new Error(
                `Elige ${grupo.minimo} opción(es) de "${grupo.nombre}" para ${producto.nombre}`
            );

        }

        if (maximo !== null && elegidasDelGrupo.length > maximo) {

            throw new Error(
                `Solo puedes elegir ${maximo} opción(es) de "${grupo.nombre}" para ${producto.nombre}`
            );

        }

    }

    return seleccionadas;
};

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
            metodo_pago_id,
            productos,
            codigo_cupon,
            notas
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

            if (!producto.disponible) {

                throw new Error(
                    `${producto.nombre} ya no está disponible`
                );

            }

            const [opcionesDisponibles] =
                await connection.query(
                    `
                    SELECT
                        id,
                        nombre,
                        precio_adicional,
                        nombre_grupo,
                        tipo_grupo,
                        min_selecciones,
                        max_selecciones
                    FROM personalizaciones_producto
                    WHERE producto_id = ?
                    ORDER BY orden, nombre
                    `,
                    [item.producto_id]
                );

            const personalizacionesData =
                validarPersonalizaciones(
                    producto,
                    opcionesDisponibles,
                    item.personalizaciones || []
                );

            let subtotal =
                Number(producto.precio_base);

            for (const personalizacion of personalizacionesData) {

                subtotal += Number(
                    personalizacion.precio_adicional
                );

            }

            subtotal *= item.cantidad;

            totalPedido += subtotal;

            detallesProcesados.push({
                producto,
                cantidad: item.cantidad,
                subtotal,
                notas: limpiarNota(item.notas),
                personalizaciones:
                    personalizacionesData
            });
        }

        let cuponId = null;
        let descuento = 0;

        if (codigo_cupon) {

            const [cuponRows] =
                await connection.query(
                    `
                    SELECT *
                    FROM cupones
                    WHERE codigo = ?
                    `,
                    [codigo_cupon.trim().toUpperCase()]
                );

            if (cuponRows.length === 0) {
                throw new Error('El cupón no existe');
            }

            const cupon = cuponRows[0];

            if (cupon.valido_hasta) {

                const hoy = new Date();
                const vencimiento = new Date(cupon.valido_hasta);

                hoy.setHours(0, 0, 0, 0);
                vencimiento.setHours(0, 0, 0, 0);

                if (vencimiento < hoy) {
                    throw new Error('El cupón ya venció');
                }

            }

            if (totalPedido < Number(cupon.compra_minima)) {
                throw new Error(
                    `Compra mínima de $${Number(cupon.compra_minima).toFixed(2)} para usar este cupón`
                );
            }

            cuponId = cupon.id;
            descuento = Math.min(
                Number(cupon.monto_descuento),
                totalPedido
            );

            totalPedido -= descuento;

        }

        /*
         Si se indicó un método de pago guardado, se valida que
         exista y pertenezca al usuario antes de vincularlo al
         pedido (nunca se confía en un id recibido del cliente).
        */
        let metodoPagoId = null;

        if (metodo_pago_id) {

            const [metodoRows] =
                await connection.query(
                    `
                    SELECT id
                    FROM metodos_pago
                    WHERE id = ?
                    AND usuario_id = ?
                    AND activo = 1
                    `,
                    [metodo_pago_id, usuarioId]
                );

            if (metodoRows.length === 0) {
                throw new Error('El método de pago guardado no es válido');
            }

            metodoPagoId = metodoRows[0].id;

        }

        /*
         El estado inicial depende de cómo se va a pagar: en efectivo se
         cobra en ventanilla (entra como recibido) y cualquier otro
         método queda esperando la confirmación del pago.
        */
        const estadoInicial =
            PAGOS_EN_VENTANILLA.includes(metodo_pago)
                ? 'recibido'
                : 'pendiente_pago';

        const codigoQR =
            `MB-${Date.now()}`;

        const [pedidoResult] =
            await connection.query(
                `
                INSERT INTO pedidos
                (
                    usuario_id,
                    horario_id,
                    cupon_id,
                    estado,
                    estado_pago,
                    tiempo_estimado_min,
                    notas,
                    total,
                    metodo_pago,
                    metodo_pago_id,
                    codigo_qr
                )
                VALUES
                (?, ?, ?, ?, 'pendiente', ?, ?, ?, ?, ?, ?)
                `,
                [
                    usuarioId,
                    horario_id,
                    cuponId,
                    estadoInicial,
                    TIEMPO_ESTIMADO_POR_ESTADO.recibido,
                    limpiarNota(notas),
                    totalPedido,
                    metodo_pago,
                    metodoPagoId,
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
                        subtotal,
                        notas
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,
                    [
                        pedidoId,
                        detalle.producto.id,
                        detalle.cantidad,
                        detalle.producto.precio_base,
                        detalle.subtotal,
                        detalle.notas
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

        await registrarCambioEstado(connection, {
            pedidoId,
            estadoAnterior: null,
            estadoNuevo: estadoInicial,
            usuarioId,
            nota: 'Pedido creado por el alumno'
        });

        await connection.commit();

        eventBus.publicar({
            tipo: 'pedido:creado',
            pedidoId,
            usuarioId,
            estado: estadoInicial
        });

        return {
            pedidoId,
            totalPedido,
            descuento,
            codigoQR,
            estado: estadoInicial
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
                p.id,
                p.estado,
                p.estado_pago,
                p.tiempo_estimado_min,
                p.motivo_cancelacion,
                p.total,
                p.metodo_pago,
                mp.tipo AS metodo_pago_tipo,
                mp.alias AS metodo_pago_alias,
                mp.referencia AS metodo_pago_referencia,
                p.codigo_qr,
                p.creado_en,
                p.actualizado_en,
                h.nombre AS horario,
                COUNT(dp.id) AS total_productos
            FROM pedidos p
            LEFT JOIN metodos_pago mp
                ON p.metodo_pago_id = mp.id
            LEFT JOIN horarios_recoleccion h
                ON p.horario_id = h.id
            LEFT JOIN detalles_pedido dp
                ON dp.pedido_id = p.id
            WHERE p.usuario_id = ?
            GROUP BY p.id
            ORDER BY p.creado_en DESC
            `,
            [usuarioId]
        );

    return rows;
};

const obtenerHistorial = async (pedidoId) => {

    const [historial] =
        await pool.query(
            `
            SELECT
                h.id,
                h.estado_anterior,
                h.estado_nuevo,
                h.nota,
                h.creado_en,
                u.nombre AS responsable,
                u.rol AS responsable_rol
            FROM historial_estados_pedido h
            LEFT JOIN usuarios u
                ON h.usuario_id = u.id
            WHERE h.pedido_id = ?
            ORDER BY h.creado_en ASC, h.id ASC
            `,
            [pedidoId]
        );

    return historial;
};

const obtenerDetalles = async (pedidoId) => {

    const [detalles] =
        await pool.query(
            `
            SELECT
                dp.id,
                dp.producto_id,
                p.nombre,
                p.url_imagen,
                dp.cantidad,
                dp.precio_unitario,
                dp.subtotal,
                dp.notas
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

    return detalles;
};

/**
 * Detalle completo de un pedido. El alumno solo puede ver los suyos;
 * el personal de la cafetería puede abrir cualquiera desde el tablero.
 */
const getOrderById = async (
    pedidoId,
    usuario
) => {

    const esPersonal =
        usuario.rol === 'admin' ||
        usuario.rol === 'empleado';

    const [pedidoRows] =
        await pool.query(
            `
            SELECT
                p.id,
                p.usuario_id,
                p.estado,
                p.estado_pago,
                p.tiempo_estimado_min,
                p.notas,
                p.motivo_cancelacion,
                p.total,
                p.metodo_pago,
                mp.tipo AS metodo_pago_tipo,
                mp.alias AS metodo_pago_alias,
                mp.referencia AS metodo_pago_referencia,
                p.codigo_qr,
                p.creado_en,
                p.actualizado_en,
                c.codigo AS cupon_codigo,
                c.monto_descuento AS cupon_descuento,
                hr.nombre AS horario,
                hr.hora_inicio AS horario_inicio,
                hr.hora_fin AS horario_fin,
                u.nombre AS cliente,
                u.matricula
            FROM pedidos p
            LEFT JOIN cupones c
                ON p.cupon_id = c.id
            LEFT JOIN metodos_pago mp
                ON p.metodo_pago_id = mp.id
            LEFT JOIN horarios_recoleccion hr
                ON p.horario_id = hr.id
            INNER JOIN usuarios u
                ON p.usuario_id = u.id
            WHERE p.id = ?
            ${esPersonal ? '' : 'AND p.usuario_id = ?'}
            `,
            esPersonal
                ? [pedidoId]
                : [pedidoId, usuario.id]
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

    pedido.productos =
        await obtenerDetalles(pedidoId);

    pedido.historial =
        await obtenerHistorial(pedidoId);

    pedido.acciones =
        obtenerTransiciones(pedido.estado, usuario.rol);

    return pedido;
};
/**
 * Listado del tablero. Acepta filtros por estado y búsqueda por
 * alumno, matrícula o código de recolección.
 */
const getAllOrders = async (filtros = {}) => {

    const condiciones = [];
    const parametros = [];

    if (filtros.estado && existeEstado(filtros.estado)) {

        condiciones.push('p.estado = ?');
        parametros.push(filtros.estado);

    }

    if (filtros.soloActivos) {

        condiciones.push(
            `p.estado IN (${ESTADOS_ACTIVOS.map(() => '?').join(', ')})`
        );

        parametros.push(...ESTADOS_ACTIVOS);

    }

    if (filtros.busqueda) {

        condiciones.push(
            '(u.nombre LIKE ? OR u.matricula LIKE ? OR p.codigo_qr LIKE ?)'
        );

        const comodin = `%${filtros.busqueda.trim()}%`;

        parametros.push(comodin, comodin, comodin);

    }

    const where =
        condiciones.length > 0
            ? `WHERE ${condiciones.join(' AND ')}`
            : '';

    const [rows] =
        await pool.query(
            `
            SELECT
                p.id,
                u.nombre AS cliente,
                u.matricula,
                p.estado,
                p.estado_pago,
                p.tiempo_estimado_min,
                p.notas,
                p.motivo_cancelacion,
                p.total,
                p.metodo_pago,
                mp.tipo AS metodo_pago_tipo,
                mp.alias AS metodo_pago_alias,
                mp.referencia AS metodo_pago_referencia,
                p.codigo_qr,
                p.creado_en,
                p.actualizado_en,
                hr.nombre AS horario,
                COALESCE(
                    (
                        SELECT GROUP_CONCAT(
                            CONCAT(dp.cantidad, 'x ', pr.nombre)
                            ORDER BY dp.id
                            SEPARATOR ' · '
                        )
                        FROM detalles_pedido dp
                        INNER JOIN productos pr
                            ON dp.producto_id = pr.id
                        WHERE dp.pedido_id = p.id
                    ),
                    ''
                ) AS resumen_productos,
                TIMESTAMPDIFF(MINUTE, p.creado_en, NOW()) AS minutos_transcurridos
            FROM pedidos p
            INNER JOIN usuarios u
                ON p.usuario_id = u.id
            LEFT JOIN metodos_pago mp
                ON p.metodo_pago_id = mp.id
            LEFT JOIN horarios_recoleccion hr
                ON p.horario_id = hr.id
            ${where}
            ORDER BY p.creado_en DESC
            `,
            parametros
        );

    return rows;
};

/**
 * Contadores por estado + indicadores del día para el encabezado del
 * tablero. Se calcula en SQL para no traerse todos los pedidos.
 */
const getOrdersSummary = async () => {

    const [porEstado] =
        await pool.query(
            `
            SELECT
                estado,
                COUNT(*) AS total
            FROM pedidos
            GROUP BY estado
            `
        );

    const [[hoy]] =
        await pool.query(
            `
            SELECT
                COUNT(*) AS pedidos_hoy,
                COALESCE(SUM(
                    CASE WHEN estado = 'entregado' THEN total ELSE 0 END
                ), 0) AS vendido_hoy,
                COALESCE(SUM(
                    CASE WHEN estado IN ('cancelado', 'rechazado') THEN 1 ELSE 0 END
                ), 0) AS cancelados_hoy
            FROM pedidos
            WHERE DATE(creado_en) = CURDATE()
            `
        );

    const [[tiempos]] =
        await pool.query(
            `
            SELECT
                ROUND(AVG(TIMESTAMPDIFF(
                    MINUTE, inicio.creado_en, fin.creado_en
                ))) AS minutos_promedio
            FROM historial_estados_pedido inicio
            INNER JOIN historial_estados_pedido fin
                ON fin.pedido_id = inicio.pedido_id
                AND fin.estado_nuevo = 'listo'
            WHERE inicio.estado_nuevo = 'preparando'
            `
        );

    const conteos = Object.keys(ESTADOS).reduce(
        (acumulado, clave) => ({
            ...acumulado,
            [clave]: 0
        }),
        {}
    );

    for (const fila of porEstado) {
        conteos[fila.estado] = Number(fila.total);
    }

    return {
        porEstado: conteos,
        activos: ESTADOS_ACTIVOS.reduce(
            (total, clave) => total + (conteos[clave] || 0),
            0
        ),
        pedidosHoy: Number(hoy.pedidos_hoy),
        vendidoHoy: Number(hoy.vendido_hoy),
        canceladosHoy: Number(hoy.cancelados_hoy),
        minutosPromedioPreparacion:
            tiempos.minutos_promedio === null
                ? null
                : Number(tiempos.minutos_promedio)
    };
};

/**
 * Única puerta de entrada para mover un pedido de estado. Valida la
 * transición contra la máquina de estados, exige motivo cuando toca,
 * escribe la bitácora y publica el evento en vivo.
 */
const updateOrderStatus = async (
    pedidoId,
    datos,
    usuario
) => {

    const {
        estado: nuevoEstado,
        nota,
        tiempo_estimado_min: tiempoEstimado
    } = datos;

    if (!existeEstado(nuevoEstado)) {

        throw new Error(
            'Estado inválido'
        );

    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const [pedidoRows] =
            await connection.query(
                `
                SELECT *
                FROM pedidos
                WHERE id = ?
                FOR UPDATE
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

        const esPersonal =
            usuario.rol === 'admin' ||
            usuario.rol === 'empleado';

        if (
            !esPersonal &&
            pedido.usuario_id !== usuario.id
        ) {

            throw new Error(
                'No puedes modificar un pedido que no es tuyo'
            );

        }

        if (pedido.estado === nuevoEstado) {

            throw new Error(
                `El pedido ya está en estado ${ESTADOS[nuevoEstado].etiqueta}`
            );

        }

        if (
            !puedeTransicionar(
                pedido.estado,
                nuevoEstado,
                usuario.rol
            )
        ) {

            throw new Error(
                `No se puede pasar de ${ESTADOS[pedido.estado].etiqueta} a ${ESTADOS[nuevoEstado].etiqueta}`
            );

        }

        const motivo = limpiarNota(nota);

        if (
            REQUIEREN_MOTIVO.includes(nuevoEstado) &&
            !motivo
        ) {

            throw new Error(
                `Indica el motivo para marcar el pedido como ${ESTADOS[nuevoEstado].etiqueta}`
            );

        }

        const minutos =
            tiempoEstimado === undefined ||
            tiempoEstimado === null ||
            tiempoEstimado === ''
                ? TIEMPO_ESTIMADO_POR_ESTADO[nuevoEstado] ?? null
                : Math.max(0, Number(tiempoEstimado));

        /*
         Si el pedido ya estaba pagado y se cancela o se rechaza, el
         pago no se "cancela": se devuelve.
        */
        let nuevoEstadoPago =
            ESTADO_PAGO_POR_ESTADO[nuevoEstado] ||
            pedido.estado_pago;

        if (
            pedido.estado_pago === 'pagado' &&
            REQUIEREN_MOTIVO.includes(nuevoEstado)
        ) {

            nuevoEstadoPago = 'reembolsado';

        }

        await connection.query(
            `
            UPDATE pedidos
            SET
                estado = ?,
                estado_pago = ?,
                tiempo_estimado_min = ?,
                motivo_cancelacion = ?
            WHERE id = ?
            `,
            [
                nuevoEstado,
                nuevoEstadoPago,
                minutos,
                REQUIEREN_MOTIVO.includes(nuevoEstado)
                    ? motivo
                    : pedido.motivo_cancelacion,
                pedidoId
            ]
        );

        await registrarCambioEstado(connection, {
            pedidoId,
            estadoAnterior: pedido.estado,
            estadoNuevo: nuevoEstado,
            usuarioId: usuario.id,
            nota: motivo
        });

        await connection.commit();

        eventBus.publicar({
            tipo: 'pedido:estado',
            pedidoId: Number(pedidoId),
            usuarioId: pedido.usuario_id,
            estado: nuevoEstado,
            estadoAnterior: pedido.estado,
            tiempoEstimado: minutos,
            nota: motivo
        });

        return {
            pedidoId: Number(pedidoId),
            estadoAnterior: pedido.estado,
            estadoNuevo: nuevoEstado,
            tiempoEstimado: minutos,
            estadoPago: nuevoEstadoPago
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
};

/**
 * Cancelación desde la app del alumno. Reutiliza la misma máquina de
 * estados, así que solo funciona mientras el pedido no esté en cocina.
 */
const cancelOrderByUser = async (
    pedidoId,
    usuario,
    motivo
) => {

    return updateOrderStatus(
        pedidoId,
        {
            estado: 'cancelado',
            nota: limpiarNota(motivo) || 'Cancelado por el alumno'
        },
        usuario
    );
};

/**
 * Confirmación del pago (tarjeta, PayPal o transferencia). Marca el
 * pago como cubierto y, si el pedido estaba esperando por eso, lo
 * empuja al tablero de la cafetería.
 */
const confirmPayment = async (
    pedidoId,
    usuario
) => {

    const [pedidoRows] =
        await pool.query(
            `
            SELECT *
            FROM pedidos
            WHERE id = ?
            `,
            [pedidoId]
        );

    if (pedidoRows.length === 0) {
        throw new Error('Pedido no encontrado');
    }

    const pedido = pedidoRows[0];

    const esPersonal =
        usuario.rol === 'admin' ||
        usuario.rol === 'empleado';

    if (
        !esPersonal &&
        pedido.usuario_id !== usuario.id
    ) {

        throw new Error(
            'No puedes pagar un pedido que no es tuyo'
        );

    }

    if (pedido.estado_pago === 'pagado') {
        throw new Error('Este pedido ya está pagado');
    }

    await pool.query(
        `
        UPDATE pedidos
        SET estado_pago = 'pagado'
        WHERE id = ?
        `,
        [pedidoId]
    );

    if (pedido.estado === 'pendiente_pago') {

        /*
         El pago lo confirma el sistema, no el personal: se ejecuta la
         transición con rol de empleado y se deja constancia en la nota.
        */
        await updateOrderStatus(
            pedidoId,
            {
                estado: 'recibido',
                nota: 'Pago confirmado en la aplicación'
            },
            {
                id: usuario.id,
                rol: 'empleado'
            }
        );

    }

    eventBus.publicar({
        tipo: 'pedido:pago',
        pedidoId: Number(pedidoId),
        usuarioId: pedido.usuario_id,
        estadoPago: 'pagado'
    });

    return {
        pedidoId: Number(pedidoId),
        estadoPago: 'pagado'
    };
};

const getOrderHistory = async (
    pedidoId,
    usuario
) => {

    const esPersonal =
        usuario.rol === 'admin' ||
        usuario.rol === 'empleado';

    const [pedidoRows] =
        await pool.query(
            `
            SELECT usuario_id
            FROM pedidos
            WHERE id = ?
            `,
            [pedidoId]
        );

    if (pedidoRows.length === 0) {
        throw new Error('Pedido no encontrado');
    }

    if (
        !esPersonal &&
        pedidoRows[0].usuario_id !== usuario.id
    ) {

        throw new Error('Pedido no encontrado');

    }

    return obtenerHistorial(pedidoId);
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    getOrdersSummary,
    getOrderHistory,
    updateOrderStatus,
    cancelOrderByUser,
    confirmPayment
};
