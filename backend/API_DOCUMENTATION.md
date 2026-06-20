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

POST /pedidos

GET /pedidos/mis-pedidos

GET /pedidos/:id

GET /pedidos/admin

PATCH /pedidos/:id/estado

---

# DASHBOARD

GET /dashboard/resumen

GET /dashboard/top-productos

GET /dashboard/ventas-hoy
