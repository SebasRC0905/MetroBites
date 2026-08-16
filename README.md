# 🍔 MetroBites

Sistema web para pedidos de cafetería universitaria desarrollado con:

* React + Vite
* React Query (estado del servidor) y Framer Motion (animaciones)
* Recharts (gráficas del panel)
* Node.js + Express
* MySQL
* JWT Authentication
* Server-Sent Events para el seguimiento de pedidos en vivo

---

# 📋 Requisitos

## Windows

Instalar:

* Node.js 20 o superior
* Git
* MySQL Server 8.0+
* MySQL Workbench (opcional)

Verificar instalación:

```bash
node -v
npm -v
git --version
mysql --version
```

---

## macOS

Instalar usando Homebrew:

```bash
brew install node
brew install git
brew install mysql
```

Iniciar MySQL:

```bash
brew services start mysql
```

Verificar instalación:

```bash
node -v
npm -v
git --version
mysql --version
```

---

# 🚀 Clonar el proyecto

```bash
git clone https://github.com/SebasRC0905/MetroBites.git
```

Entrar al proyecto:

```bash
cd MetroBites
```

---

# 🗄️ Configuración de Base de Datos

## Crear base de datos

Entrar a MySQL:

```sql
CREATE DATABASE metrobites_db;
```

---

## Importar estructura

### Opción 1: MySQL Workbench

1. Abrir MySQL Workbench
2. Server → Data Import
3. Import from Self-Contained File
4. Seleccionar:

```text
database/schema.sql
```

5. Seleccionar:

```text
metrobites_db
```

6. Start Import

---

## Importar datos iniciales

Repetir el proceso usando:

```text
database/seed.sql
```

---

## Migraciones

`database/schema.sql` ya incluye la estructura más reciente. Las
migraciones solo se aplican sobre una base **creada antes** de esos
cambios, en orden y una sola vez:

```bash
mysql -u root -p metrobites_db < database/migrations/001_metodos_pago_pedidos.sql
mysql -u root -p metrobites_db < database/migrations/002_estados_pedido_y_personalizacion.sql
```

La migración 002 agrega el ciclo de vida completo del pedido, la
bitácora de estados y las plantillas de personalización por categoría.

---

## Opción 2: Línea de comandos

Windows:

```bash
mysql -u root -p metrobites_db < database/schema.sql
mysql -u root -p metrobites_db < database/seed.sql
```

macOS:

```bash
mysql -u root -p metrobites_db < database/schema.sql
mysql -u root -p metrobites_db < database/seed.sql
```

---

# ⚙️ Configuración del Backend

Entrar a la carpeta backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo:

```text
.env
```

Usando como referencia:

```text
.env.example
```

Contenido sugerido:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=

DB_NAME=metrobites_db

JWT_SECRET=metrobites_secret
```

---

# ▶️ Ejecutar Backend

Desde la carpeta backend:

```bash
npm run dev
```

Debe aparecer:

```text
Servidor ejecutándose en puerto 3000
```

API disponible en:

```text
http://localhost:3000/api
```

Health Check:

```text
http://localhost:3000/api/health
```

---

# 🎨 Configuración del Frontend

Abrir una nueva terminal.

Entrar a frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

---

# ▶️ Ejecutar Frontend

```bash
npm run dev
```

Abrir:

```text
http://localhost:5173
```

---

# 📂 Estructura del Proyecto

```text
MetroBites
│
├── backend
│   ├── src
│   ├── uploads
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── database
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations
│
├── docs
│
└── README.md
```

---

# 🔐 Roles del Sistema

* alumno
* empleado
* admin

---

# 📦 Funcionalidades

## Usuarios

* Registro
* Inicio de sesión
* Perfil
* Preferencias

## Productos

* Listado de productos
* Categorías
* Personalización por tipo de comida (grupos de opción única o
  múltiple, con mínimos y máximos, más notas para la cocina)
* Administración de productos

## Pedidos

* Crear pedido
* Historial de pedidos
* Seguimiento en vivo (SSE) con línea de tiempo y tiempo estimado
* Cancelación desde la app mientras el pedido no entra a cocina
* Tablero administrativo por estados con bitácora

## Ciclo de vida del pedido

```text
pendiente_pago → recibido → confirmado → preparando → listo → entregado
```

Salidas de excepción: `cancelado` (alumno o cafetería), `rechazado`
(la cafetería no lo puede tomar) y `no_recogido`. Cada cambio queda
registrado en `historial_estados_pedido` con quién lo hizo y por qué;
cancelar o rechazar exige un motivo que el alumno alcanza a ver.

## Integraciones con APIs públicas

| Servicio | Uso en la app |
| --- | --- |
| Open-Meteo | Clima del campus y sugerencia de categoría |
| Open Food Facts | Referencia nutrimental de cada platillo |
| Frankfurter (BCE) | Precios en dólares o euros |
| Nager.Date | Días festivos en que la cafetería no abre |

Ninguna requiere llave ni pago. El detalle de cada endpoint está en
`backend/API_DOCUMENTATION.md`.

## Favoritos

* Agregar favoritos
* Eliminar favoritos

---

# 🌿 Flujo de Trabajo con Git

Antes de comenzar:

```bash
git pull
```

Crear una rama:

```bash
git checkout -b feature-nueva-funcionalidad
```

Guardar cambios:

```bash
git add .
git commit -m "Descripción del cambio"
```

Subir cambios:

```bash
git push origin feature-nueva-funcionalidad
```

Crear Pull Request en GitHub.

---

# 🚫 No subir a GitHub

Nunca subir:

```text
.env
node_modules
dist
build
```

Solo compartir:

```text
.env.example
```

---

# 👥 Equipo de Desarrollo

- Sebastián Ruiz Cortés

Proyecto académico desarrollado para la Universidad Politécnica Metropolitana de Hidalgo (UPMH).

MetroBites busca optimizar el proceso de pedidos de alimentos permitiendo a los estudiantes realizar órdenes desde el aula y recogerlas en horarios establecidos.
