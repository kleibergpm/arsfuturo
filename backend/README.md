# Backend ARS Futuro

API REST MVC con Express, Prisma y PostgreSQL. La documentación interactiva estará disponible en `http://localhost:4000/api/docs`.

## Índice

- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Inicializar la base de datos](#inicializar-la-base-de-datos)
- [Ejecutar la API](#ejecutar-la-api)
- [API](#api)

## Instalación local

Desde la carpeta `backend`:

```powershell
npm install
Copy-Item .env.example .env
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

El repositorio actual no contiene migraciones en `prisma/migrations`, por lo que `npx prisma db push` es el comando correcto para preparar las tablas. Los scripts SQL de `sql/` son una alternativa manual; no los combines con Prisma sobre una base ya inicializada.

## Variables de entorno

Edita `.env` con los valores de tu instalación:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ars_futuro?schema=public"
JWT_SECRET="una-clave-larga-y-privada"
PORT=4000
CORS_ORIGIN="http://localhost:5173"
```

`DATABASE_URL` usa el usuario, contraseña, host, puerto y base de datos de PostgreSQL. `JWT_SECRET` puede ser cualquier clave aleatoria larga, pero no debe publicarse ni cambiarse mientras haya sesiones activas.

## Inicializar la base de datos

Si ya existen las 11 tablas y solo necesitas datos demo, ejecuta únicamente:

```powershell
npm run prisma:seed
```

## Ejecutar la API

```powershell
npm run dev
```

Comprueba el servicio en `http://localhost:4000/health` y abre Swagger en `http://localhost:4000/api/docs`.

Los datos iniciales incluyen `admin/admin123`, `agente/agente123` y `supervisor/super123`. Cámbielos antes de usar el sistema fuera de desarrollo.

## API

Todos los endpoints, salvo `POST /api/auth/login` y `/health`, requieren `Authorization: Bearer <token>`.

- Recursos: `/api/afiliados`, `/api/proveedores`, `/api/planes`, `/api/polizas`, `/api/reclamos`, `/api/autorizaciones`, `/api/servicios`, `/api/pagos`, `/api/facturas`, `/api/notificaciones`.
- Operaciones de negocio: autorizaciones `/:id/aprobar|rechazar`, facturas `/generar`, `/:id/pagar|recordatorio|gracia|suspender`, y pagos `POST /api/pagos`.
