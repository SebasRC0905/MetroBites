# 🍔 MetroBites

Sistema web para pedidos de cafetería universitaria desarrollado con:

* React + Vite
* Node.js + Express
* MySQL
* JWT Authentication

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
* Personalizaciones
* Administración de productos

## Pedidos

* Crear pedido
* Historial de pedidos
* Seguimiento de estado
* Dashboard administrativo

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
