# MetroBites API Documentation

## Base URL

http://localhost:3000/api

---

# AUTH

## Registro

POST /auth/register

Body:

{
"matricula": "2230110",
"nombre": "Sebastian Ruiz",
"correo": "[sebastian@upmh.edu.mx](mailto:sebastian@upmh.edu.mx)",
"password": "12345678"
}

---

## Login

POST /auth/login

Body:

{
"correo": "[sebastian@upmh.edu.mx](mailto:sebastian@upmh.edu.mx)",
"password": "12345678"
}

---

## Perfil

GET /auth/profile

Headers:

Authorization: Bearer TOKEN

---

# CATEGORIAS

GET /categorias

---

# PRODUCTOS

GET /productos

GET /productos/detalle/:id

GET /productos/categoria/:id

El detalle incluye `personalizaciones`: una lista plana de opciones donde
cada una trae la configuración de su grupo.

| Campo | Significado |
| --- | --- |
| `nombre_grupo` | Grupo al que pertenece ("Tamaño", "Salsa", "Extras"…) |
| `tipo_grupo` | `unica` (radio) o `multiple` (casillas) |
| `min_selecciones` | Mínimo obligatorio del grupo (0 = opcional) |
| `max_selecciones` | Máximo permitido (`null` = sin límite) |
| `orden` / `orden_opcion` | Orden del grupo y de la opción dentro del grupo |
| `precio_adicional` | Lo que suma al precio base |

Los grupos salen de la plantilla de la categoría del producto
(`plantillas_personalizacion`), por eso una bebida pide "Tamaño /
Temperatura" y una torta pide "Tipo de pan / Salsa".

---

# FAVORITOS

GET /favoritos

POST /favoritos

DELETE /favoritos/:productoId

---

# HORARIOS

GET /horarios

---

# PEDIDOS

## Crear pedido

POST /pedidos

Body:

{
"horario_id": 1,
"metodo_pago": "efectivo",
"metodo_pago_id": null,
"codigo_cupon": "BIENVENIDO",
"notas": "Para llevar",
"productos": [
{ "producto_id": 4, "cantidad": 2, "personalizaciones": [73, 76], "notas": "Sin azúcar" }
]
}

El servidor valida las reglas de cada grupo de personalización
(obligatorios, máximos) y responde 400 con el mensaje exacto si algo no
cumple. El estado inicial es `recibido` si el pago es en efectivo y
`pendiente_pago` en cualquier otro método.

## Consulta

GET /pedidos/mis-pedidos

GET /pedidos/:id — detalle con productos, personalizaciones, notas,
bitácora (`historial`) y las acciones permitidas para tu rol (`acciones`)

GET /pedidos/:id/historial

GET /pedidos/estados — catálogo de estados: etiquetas, colores, columnas
del tablero y transiciones permitidas según el rol

## Operación (admin / empleado)

GET /pedidos/admin?estado=&busqueda=&activos=true

GET /pedidos/admin/resumen — conteos por estado e indicadores del día

PATCH /pedidos/:id/estado

Body:

{ "estado": "preparando", "nota": "Entra después del #42", "tiempo_estimado_min": 10 }

## Acciones del alumno

PATCH /pedidos/:id/cancelar — body `{ "motivo": "..." }`

PATCH /pedidos/:id/pago — confirma el pago de un pedido en
`pendiente_pago`

## Tiempo real (Server-Sent Events)

POST /pedidos/stream/ticket — devuelve un ticket de un solo uso (60 s)

GET /pedidos/stream?ticket=... — stream SSE. El personal recibe todos
los pedidos; el alumno solo los suyos.

Eventos: `conectado`, `pedido` (con `tipo`: `pedido:creado`,
`pedido:estado`, `pedido:pago`).

## Ciclo de vida del pedido

| Estado | Puede pasar a | Quién |
| --- | --- | --- |
| `pendiente_pago` | `recibido`, `cancelado`, `rechazado` | personal (alumno solo cancela) |
| `recibido` | `confirmado`, `cancelado`, `rechazado` | personal (alumno solo cancela) |
| `confirmado` | `preparando`, `cancelado`, `rechazado` | personal (alumno solo cancela) |
| `preparando` | `listo`, `cancelado` | personal |
| `listo` | `entregado`, `no_recogido` | personal |
| `entregado`, `cancelado`, `rechazado`, `no_recogido` | — | estado final |

`cancelado` y `rechazado` exigen un motivo, que se guarda en la bitácora
y se le muestra al alumno.

---

# DASHBOARD

GET /dashboard/resumen

GET /dashboard/top-productos

GET /dashboard/ventas-hoy

GET /dashboard/ventas-por-dia?dias=7

GET /dashboard/pedidos-por-hora

---

# INTEGRACIONES EXTERNAS

Todas son APIs públicas y gratuitas, sin llave. El backend les pone
timeout y caché en memoria, y si el proveedor falla devuelve el último
dato conocido antes que romper la vista.

| Endpoint | Proveedor | Para qué sirve | Caché |
| --- | --- | --- | --- |
| GET /clima/actual | Open-Meteo | Clima del campus y sugerencia de categoría | 10 min |
| GET /nutricion/producto/:id | Open Food Facts | Referencia nutrimental del platillo | 24 h |
| GET /nutricion/buscar?q= | Open Food Facts | Búsqueda libre de información nutrimental | 24 h |
| GET /divisas/tasas | Frankfurter (BCE) | Precios en USD y EUR | 6 h |
| GET /divisas/convertir?monto=&moneda= | Frankfurter (BCE) | Conversión puntual | 6 h |
| GET /festivos/proximos?limite=3 | Nager.Date | Días sin servicio en la cafetería | 24 h |
