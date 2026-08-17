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
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/migrations/001_metodos_pago_pedidos.sql
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/migrations/002_estados_pedido_y_personalizacion.sql
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/migrations/003_perfil_alumno.sql
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/migrations/004_reparar_acentos.sql
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/migrations/005_catalogo_ampliado.sql
```

* **002** agrega el ciclo de vida completo del pedido, la bitácora de
  estados y las plantillas de personalización por categoría.
* **003** agrega la foto de perfil, el teléfono de contacto y completa
  el catálogo de preferencias dietéticas.
* **004** repara los acentos si alguna migración se importó sin
  `--default-character-set=utf8mb4` (ver abajo).
* **005** agrega 16 productos nuevos con foto y completa las fotos de
  los que ya existían.

---

## ⚠️ Acentos: usa siempre `--default-character-set=utf8mb4`

En Windows el cliente `mysql` arranca con la página de códigos de la
consola (`cp850`). Si importas un archivo `.sql` en UTF-8 sin indicarle
el juego de caracteres, el servidor interpreta mal cada byte y "Tamaño"
termina guardado como "Tama├▒o".

Por eso todos los comandos de arriba llevan `--default-character-set=utf8mb4`,
y las migraciones traen `SET NAMES utf8mb4;` en su primera línea.

Si ya te pasó, la migración 004 lo repara sin tocar las filas correctas.
Para comprobar cómo quedó guardado un texto:

```bash
mysql -u root -p --default-character-set=utf8mb4 metrobites_db -e "SELECT nombre, HEX(nombre) FROM personalizaciones_producto WHERE nombre LIKE 'Jalape%';"
```

La ñ debe verse como los bytes `C3B1`. Si aparece `E2949CE29692`, falta
correr la migración 004.

Al generar respaldos, el mismo cuidado:

```bash
mysqldump -u root -p --default-character-set=utf8mb4 metrobites_db > respaldo.sql
```

---

## Opción 2: Línea de comandos

Windows:

```bash
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/schema.sql
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/seed.sql
```

macOS:

```bash
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/schema.sql
mysql -u root -p --default-character-set=utf8mb4 metrobites_db < database/seed.sql
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

DOMINIO_INSTITUCIONAL=upmh.edu.mx
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

* Registro **solo con correo institucional** `@upmh.edu.mx`
  (configurable con la variable `DOMINIO_INSTITUCIONAL`)
* Inicio de sesión con límite de intentos por IP
* Perfil con foto, teléfono de contacto y datos editables
* Alergias y estilo de vida, que avisan si un platillo puede
  contener algo que marcaste
* Cambio de contraseña desde el propio perfil

## Productos

* Menú de 23 productos con foto, repartidos en cinco categorías
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

## Fotos del menú

Las imágenes de `backend/uploads` vienen de Wikimedia Commons con
licencias libres, recortadas a 880 × 605 px (la proporción de la
tarjeta del menú). El autor y la licencia de cada una están en
`docs/creditos-imagenes.md`: si cambias una foto, actualiza también esa
tabla, porque las licencias CC BY y CC BY-SA piden dar crédito.

## Seguridad de la API

* Validación de entrada con `express-validator` y respuestas de error
  con la misma forma en toda la API.
* Límite de intentos por IP en inicio de sesión, registro y cambio de
  contraseña.
* Subida de archivos solo con sesión iniciada, con tope de 3 MB, tipos
  permitidos (JPG, PNG, WEBP, GIF) y nombre generado al azar.
* Manejador global de errores y de rutas inexistentes: la API nunca
  responde HTML ni deja una petición sin contestar.
* Permisos por rol validados en el servidor, no solo en la interfaz.

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
