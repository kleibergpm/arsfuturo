**Proyecto:** ARS Futuro

Proyecto full-stack para la gestión de una Administradora de Riesgos de Salud (ARS), con backend en Express + TypeScript + Prisma + PostgreSQL y frontend en React + Vite + Tailwind CSS.

**Asignatura:** INF-5250 – Ingeniería de Software II

**Semestre:** 2026-2

**Profesor:** Amancio Lorenzo Lorenzo

**Seccion:** Z01

**Proyecto:** ARS Futuro

**Grupo:** The code society

---

## 👥 Integrantes del equipo
| Integrante                       | Matrícula | Rol |
| -------------------------------- | --------: | --------: |
| Anderson Antonio Castillo Peláez | 100631535 | Desarrollador Full-Stack |
| Kleiber Gabriel Pérez Montero    | 100453725 | Desarrollador BackEnd / QA Engineer |
| Eric Vladimir Tejada Nieve       |    FF1944 | Desarrollador FrontEnd |
| Mayobanex Vicente Soto           | 100417556 | Desarrollador FrontEnd |

---

## 📊 Estado del Proyecto

[![Version](https://img.shields.io/github/v/release/kleibergpm/arsfuturo?logo=github&label=version)](https://github.com/kleibergpm/arsfuturo/releases)
[![Last Commit](https://img.shields.io/github/last-commit/kleibergpm/arsfuturo?logo=github)](https://github.com/kleibergpm/arsfuturo/commits)
[![Issues](https://img.shields.io/github/issues/kleibergpm/arsfuturo?logo=github)](https://github.com/kleibergpm/arsfuturo/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/kleibergpm/arsfuturo?logo=github)](https://github.com/kleibergpm/arsfuturo/pulls)
[![License](https://img.shields.io/github/license/kleibergpm/arsfuturo?logo=github)](https://github.com/kleibergpm/arsfuturo/blob/main/LICENSE)

## 🛠️ Stack Tecnológico

### FrontEnd
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

### BackEnd
[![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

## Índice

- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación rápida](#instalación-rápida)
- [Configuración de entorno](#configuración-de-entorno)
- [Ejecución local](#ejecución-local)
- [Documentación por módulo](#documentación-por-módulo)
- [Comandos útiles](#comandos-útiles)

## Estructura del proyecto

```text
arsfuturo/
├── backend/              # API REST con Express + Prisma + PostgreSQL
│   ├── .env.example      # plantilla de variables del backend
│   ├── k6/               # pruebas de carga con K6
│   ├── prisma/           # schema y seed de Prisma
│   ├── sql/              # scripts SQL de inicialización
│   ├── src/              # código de la API
│   └── README.md         # documentación del backend
├── FrontEnd/             # frontend React + Vite + Tailwind
│   ├── README.md         # documentación del frontend
│   └── src/              # código del cliente
├── docs/                 # diagramas y documentación adicional
├── GUION_PRESENTACION.md # guía de presentación
├── README.md             # este archivo
└── package.json          # opcional, si se añade en el futuro
```

## Requisitos previos

Antes de iniciar, asegúrate de tener instalado:

- Node.js 20+
- npm
- PostgreSQL 14+
- Git
- K6 (solo si vas a ejecutar pruebas de carga)

## Instalación rápida

### 1) Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/arsfuturo.git
cd arsfuturo
```

### 2) Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3) Copiar variables de entorno

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4) Crear la base de datos PostgreSQL

Asegúrate de tener una base llamada `ars_futuro` en PostgreSQL.

### 5) Configurar el archivo `.env`

Ejemplo:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ars_futuro?schema=public"
JWT_SECRET="una-clave-larga-y-privada"
CORS_ORIGIN="http://localhost:5173"
```

## Configuración de entorno

### Backend

El archivo `.env.example` se encuentra en la carpeta backend y ya incluye las variables principales:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ars_futuro?schema=public"
JWT_SECRET="cambia-esta-clave-por-una-aleatoria-y-segura"
CORS_ORIGIN="http://localhost:5173"
```

### Frontend

En la carpeta frontend puede configurarse un `.env` con:

```env
VITE_API_URL=http://localhost:4000/api
```

## Ejecución local

### Backend

```bash
cd backend
npm run prisma:generate
npx prisma db push
npm run prisma:seed
npm run dev
```

La API queda disponible en:

- `http://localhost:4000`
- `http://localhost:4000/health`
- `http://localhost:4000/api/docs`

### Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

La app queda disponible en:

- `http://localhost:5173`

## Documentación por módulo

- [Backend README](backend/README.md)
- [Frontend README](FrontEnd/README.md)
- [K6 README](backend/k6/README.md)
- [Diagramas UML](docs/DIAGRAMAS_UML.md)
- [Guion de presentación](GUION_PRESENTACION.md)

## Comandos útiles

### Backend

```bash
cd backend
npm run dev
npm run typecheck
npm test
npm run prisma:generate
npm run prisma:seed
```

### Frontend

```bash
cd FrontEnd
npm install
npm run dev
npm run build
npm run preview
```

### K6

```bash
cd backend
k6 run k6/auth-smoke.js
k6 run k6/crud-endpoints.js
k6 run k6/business-endpoints.js
```

## Credenciales demo

El proyecto incluye usuarios de prueba por defecto:

- `admin / admin123`
- `agente / agente123`
- `supervisor / super123`

> Recomendación: cambialos antes de usar el sistema fuera del entorno local de desarrollo.

