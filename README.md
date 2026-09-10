**Asignatura:** INF-5250 – Ingeniería de Software II  
**Proyecto:** ARS Futuro

---

## 👥 Integrantes del equipo
| Integrante                       | Matrícula |
| -------------------------------- | --------: |
| Anderson Antonio Castillo Peláez | 100631535 |
| Kleiber Gabriel Pérez Montero    | 100453725 |
| Eric Vladimir Tejada Nieve       |    FF1944 |
| Mayobanex Vicente Soto           | 100417556 |

# ARS Futuro

**General:**
![Version](https://img.shields.io/badge/version-1.0.0-blue?logo=semantic-release&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

**FrontEnd:**
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

**BackEnd:**
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v20+-brightgreen?logo=node.js&logoColor=white)

---

Sistema de gestión para una Administradora de Riesgos de Salud (ARS). El proyecto es una aplicación web full-stack moderna construida utilizando **TypeScript** tanto en el backend como en el frontend, con una arquitectura MVC robusta y escalable.

## Índice

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Guía de Instalación y Ejecución](#guía-de-instalación-y-ejecución-desde-github)
- [Configuración de la Base de Datos](#2-configurar-la-base-de-datos-postgresql)
- [Configuración del Backend](#3-configuración-y-ejecución-del-backend-typescript)
- [Configuración del Frontend](#4-configuración-y-ejecución-del-frontend-react-typescript)
- [Comandos Útiles](#desarrollo-y-comandos-útiles)
- [Solución de Problemas](#solución-a-posibles-errores-comunes)
- [Documentación Adicional](#documentación-adicional)

## Antes de comenzar

El proyecto se ejecuta con dos procesos independientes: PostgreSQL y el backend, más el servidor Vite del frontend. Para desarrollo local necesitas dos terminales abiertas. Las rutas de los comandos están optimizadas para Windows PowerShell, pero incluyen notas para Linux/macOS.

---

## Estructura del Proyecto

```text
arsfuturo/
├── FrontEnd/          # Cliente React + Vite + Tailwind CSS (TypeScript)
├── backend/           # API Express + Prisma ORM + PostgreSQL (TypeScript)
│   ├── prisma/        # Esquema y scripts de seed de Prisma
│   └── sql/           # Scripts de creación e inicialización SQL tradicionales
├── docs/              # Diagramas de arquitectura y casos de uso UML
└── GUION_PRESENTACION.md
```

---

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de iniciar:

- **Node.js** v20 o superior (viene con `npm` integrado).
- **PostgreSQL** v14 o superior.
- **Git** (para clonar y gestionar el repositorio).

Comprueba tus versiones en la consola con:

```powershell
node --version
npm --version
psql --version
```

---

## Guía de Instalación y Ejecución (Desde GitHub)

Sigue estos pasos detallados para poner en marcha el proyecto de manera local partiendo desde el repositorio de GitHub:

### 1. Clonar el Repositorio
Abre tu terminal y clona el proyecto en tu máquina local:

```bash
git clone https://github.com/tu-usuario/arsfuturo.git
cd arsfuturo
```

---

### 2. Configurar la Base de Datos (PostgreSQL)

Tienes dos alternativas para preparar tu base de datos:

#### Opción A: Usando Scripts SQL tradicionales
1. Crea la base de datos e importa el esquema e inicialización demo ejecutando en tu terminal (en Windows/PowerShell):
   ```powershell
   psql -U postgres -d postgres -c "CREATE DATABASE ars_futuro"
   psql -U postgres -d ars_futuro -f .\backend\sql\init-postgresql.sql
   psql -U postgres -d ars_futuro -f .\backend\sql\seed-postgresql.sql
   ```
   *(Nota: Introduce tu contraseña de PostgreSQL cuando te sea solicitada).*

#### Opción B: Usando Prisma ORM (Recomendado)
1. Primero configura el archivo `.env` del backend (ver paso 3).
2. El repositorio actual no contiene una carpeta de migraciones Prisma. Usa `db push` para crear las tablas desde `backend/prisma/schema.prisma`:
   ```bash
   cd backend
   npm run prisma:generate
   npx prisma db push
   npm run prisma:seed
   ```

Los usuarios demo preconfigurados para realizar pruebas son:
- **Administrador**: `admin / admin123`
- **Agente**: `agente / agente123`
- **Supervisor**: `supervisor / super123`

---

### 3. Configuración y Ejecución del Backend (TypeScript)

El backend utiliza **TypeScript** de forma nativa en desarrollo a través de la herramienta `tsx` (TypeScript Execute), eliminando la necesidad de pasos de compilación manuales durante el desarrollo.

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno. Copia el archivo de ejemplo:
   ```powershell
   Copy-Item .env.example .env
   ```
   *(O en Linux/macOS: `cp .env.example .env`)*
4. Abre el archivo `.env` recientemente creado y edita las siguientes variables con tus credenciales de PostgreSQL y seguridad deseada:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ars_futuro?schema=public"
   JWT_SECRET="una_clave_secreta_y_segura_para_firmar_tokens"
   ```
5. Genera el cliente Prisma localmente:
   ```bash
   npm run prisma:generate
   ```
6. Inicia el servidor de desarrollo en modo observador (watch mode):
   ```bash
   npm run dev
   ```

El servidor backend se iniciará y estará disponible en:
- API REST: `http://localhost:4000`
- Estado de Salud: `http://localhost:4000/health`
- Documentación de la API (Swagger UI): `http://localhost:4000/api/docs`

---

### 4. Configuración y Ejecución del Frontend (React + TypeScript)

El frontend utiliza **React + TypeScript** compilado de forma ultrarrápida a través de **Vite**.

1. Abre una nueva terminal en la raíz del proyecto y navega a la carpeta del frontend:
   ```bash
   cd FrontEnd
   ```
2. Instala las dependencias del cliente:
   ```bash
   npm install
   ```
3. Opcionalmente crea el archivo `.env` desde `.env.example` si necesitas configurar la URL de la API:
   ```powershell
   Copy-Item .env.example .env
   ```
   Para desarrollo local debe contener `VITE_API_URL=http://localhost:4000/api`.
4. Arranca el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```

La interfaz web del cliente estará disponible de inmediato en:
- Dirección local: `http://localhost:5173`

---

## Desarrollo y Comandos Útiles

Tanto la API como la interfaz cuentan con soporte completo para comprobación de tipos y herramientas de desarrollo TypeScript:

| Ubicación | Comando | Propósito |
| --- | --- | --- |
| `backend/` | `npm run dev` | Arranca el backend de TypeScript usando `tsx watch`. |
| `backend/` | `npm run typecheck` | Ejecuta `tsc` para realizar análisis de tipos estáticos en el backend sin compilar. |
| `backend/` | `npm test` | Ejecuta el set de pruebas unitarias y de integración utilizando `vitest`. |
| `backend/` | `npm run prisma:generate` | Actualiza la estructura del cliente Prisma de acuerdo al archivo `schema.prisma`. |
| `FrontEnd/` | `npm run dev` | Arranca el entorno de desarrollo del cliente con Vite. |
| `FrontEnd/` | `npm run build` | Compila el frontend TypeScript en archivos de producción listos para desplegar. |
| `FrontEnd/` | `npm run preview` | Sirve localmente los archivos compilados del build de producción para pruebas previas. |

---

## Orden de Ejecución

El orden recomendado es:

1. Iniciar PostgreSQL
2. Ejecutar el backend con `npm run dev`.
3. Ejecutar el frontend con `npm run dev`.
4. Iniciar sesión en la aplicación.


## Solución a Posibles Errores Comunes

### 1. Error: `P1001: Can't reach database server...`
* **Causa**: El backend no puede comunicarse con tu instancia de PostgreSQL.
* **Solución**:
  - Verifica que el servicio de PostgreSQL esté iniciado y ejecutándose en tu computadora.
  - Asegúrate de que el usuario, contraseña y puerto indicados en la variable `DATABASE_URL` del archivo `.env` del backend sean 100% correctos.
  - Comprueba que la base de datos `ars_futuro` realmente existe en tu sistema.

### 2. Error: `Prisma Client has not been generated yet...` o tipos desactualizados en código
* **Causa**: No se ha construido el cliente de base de datos intermedio de Prisma tras una instalación limpia o tras modificar el esquema de base de datos.
* **Solución**: Ejecuta el siguiente comando en la carpeta `backend/`:
  ```bash
  npm run prisma:generate
  ```

### 3. Error de compilación en el Backend o errores al arrancar con `tsx`
* **Causa**: Problemas menores con las definiciones de tipos globales o diferencias de versión de Node.
* **Solución**:
  - Asegúrate de estar usando Node v20 o posterior.
  - Ejecuta `npm run typecheck` en la carpeta `backend/` para identificar exactamente qué líneas de código TypeScript tienen discrepancias de tipos.

### 4. Error: `CORS Policy Blocked...` al hacer peticiones HTTP
* **Causa**: El backend está rechazando las solicitudes provenientes del dominio/puerto del frontend.
* **Solución**: El backend tiene preconfigurado CORS, pero asegúrate de que la API de desarrollo corre en el puerto `4000` y el cliente en el puerto `5173`, que son los predeterminados. Si cambias los puertos, actualiza la variable `CORS_ORIGIN` en el archivo `.env` del backend.

### 5. La interfaz aparece sin estilos
* **Causa**: Tailwind no encontró las clases usadas en los archivos TypeScript/TSX o Vite está sirviendo un resultado anterior.
* **Solución**: confirma que `FrontEnd/tailwind.config.ts` incluya `js,jsx,ts,tsx`, detén y reinicia Vite desde `FrontEnd`, y fuerza una recarga con `Ctrl+F5`.
   ```powershell
   cd FrontEnd
   npm run dev
   ```

### 6. Migración a TypeScript del frontend

El frontend utiliza archivos `.ts` y `.tsx` para código, componentes y configuración. No necesitas instalar un compilador global ni `ts-node`: Vite y TypeScript se instalan localmente con `npm install`.

Después de clonar o actualizar el proyecto, ejecuta:

```powershell
cd FrontEnd
npm install
npx tsc --noEmit
npm run build
```

### 7. `node_modules` corrupto o errores extraños de instalación
* **Causa**: Una instalación interrumpida de npm o dependencias cacheadas conflictivas.
* **Solución**: Limpia y reinstala las dependencias en la carpeta afectada (ya sea `backend/` o `FrontEnd/`):
  - Elimina la carpeta `node_modules` y el archivo `package-lock.json`.
  - Vuelve a ejecutar `npm install`.

## Documentación adicional

- [Documentación del backend](backend/README.md)
- [Diagramas UML](docs/DIAGRAMAS_UML.md)
- [Guion de presentación](GUION_PRESENTACION.md)
