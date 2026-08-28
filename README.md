# ARS Futuro

Sistema de gestión para una Administradora de Riesgos de Salud (ARS). El proyecto está dividido en un cliente web React y una API REST MVC con Express, PostgreSQL y Prisma.

## Estructura

```text
arsfuturo/
├── FrontEnd/          # React + Vite + Tailwind
├── backend/           # Express + Prisma + PostgreSQL
│   ├── prisma/        # Esquema y seed de Prisma
│   └── sql/           # Scripts de creación y datos demo
├── docs/              # Diagramas UML
└── GUION_PRESENTACION.md
```

## Requisitos

- Node.js **20 o superior** (npm viene incluido con Node.js).
- PostgreSQL 14 o superior.
- Git (opcional).

Comprueba tus versiones con:

```powershell
node --version
npm --version
psql --version
```

## Configurar la base de datos

Desde `backend/`, crea y carga la base de datos con los scripts SQL:

```powershell
psql -U postgres -d postgres -c "CREATE DATABASE ars_futuro"
psql -U postgres -d ars_futuro -f .\sql\init-postgresql.sql
psql -U postgres -d ars_futuro -f .\sql\seed-postgresql.sql
```

> Si ya ejecutaste `CREATE DATABASE`, omite el primer comando. Los usuarios demo son `admin/admin123`, `agente/agente123` y `supervisor/super123`.

## Ejecutar en desarrollo

Abre dos terminales desde la raíz del repositorio.

### Backend

```powershell
cd backend
Copy-Item .env.example .env
# Edita .env y define DATABASE_URL y JWT_SECRET.
npm install
npm run prisma:generate
npm run dev
```

La API queda disponible en `http://localhost:4000`, su estado en `/health` y la documentación en `/api/docs`.

### Frontend

```powershell
cd FrontEnd
npm install
npm run dev
```

La interfaz queda disponible en `http://localhost:5173`.

## Comandos útiles

| Ubicación | Comando | Propósito |
| --- | --- | --- |
| `FrontEnd/` | `npm run build` | Genera la compilación de producción. |
| `FrontEnd/` | `npm run preview` | Sirve la compilación localmente. |
| `backend/` | `npm run prisma:generate` | Genera el cliente Prisma. |
| `backend/` | `npm run prisma:seed` | Carga datos demo mediante Prisma. |
| `backend/` | `npm test` | Ejecuta las pruebas del backend. |

## Notas

- `node_modules` no se versiona. Si una instalación se interrumpe, elimina la carpeta `node_modules` dentro del componente afectado y ejecuta `npm install` otra vez.
- La conexión entre el frontend y la API se realizará mediante Axios; los datos de demostración actuales del cliente todavía no han sido reemplazados por llamadas HTTP.
