# Backend ARS Futuro

API REST MVC con Express, Prisma y PostgreSQL. La documentación interactiva estará disponible en `http://localhost:4000/api/docs`.

## Índice

- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Inicializar la base de datos](#inicializar-la-base-de-datos)
- [Ejecutar la API](#ejecutar-la-api)
- [API](#api)

## Instalación local

Desde la carpeta del backend:

```bash
cd backend
npm install
```

Copia el archivo de ejemplo del entorno:

```powershell
npm install
Copy-Item .env.example .env
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

El repositorio actual no contiene migraciones en `prisma/migrations`, por lo que `npx prisma db push` es el comando correcto para preparar las tablas. Los scripts SQL de `sql/` son una alternativa manual; no los combines con Prisma sobre una base ya inicializada.

## Variables de entorno

Edita el archivo `.env` con tus valores locales:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/ars_futuro?schema=public"
JWT_SECRET="una-clave-larga-y-privada"
CORS_ORIGIN="http://localhost:5173"
```

### Descripción de variables

- `PORT`: puerto en el que correrá la API
- `DATABASE_URL`: conexión a PostgreSQL
- `JWT_SECRET`: clave para firmar tokens JWT
- `CORS_ORIGIN`: origen permitido por CORS del frontend

> El archivo `.env.example` ya está incluido en la carpeta backend y sirve como base segura para la configuración local.

## Base de datos

Si tu proyecto no tiene migraciones generadas, crea la estructura desde Prisma:

```bash
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

Si solo deseas reiniciar los datos demo, puedes ejecutar:

```bash
npm run prisma:seed
```

El repositorio actual no contiene migraciones en `prisma/migrations`, por lo que `npx prisma db push` es el comando recomendado para preparar las tablas. Los scripts SQL de `sql/` son una alternativa manual, pero no deben mezclarse con Prisma en una base ya inicializada.

## Ejecutar la API

```bash
npm run dev
```

Verifica:

- `http://localhost:4000/health`
- `http://localhost:4000/api/docs`

Los datos iniciales incluyen:

- `admin / admin123`
- `agente / agente123`
- `supervisor / super123`

## API

Todos los endpoints, salvo `POST /api/auth/login` y `/health`, requieren autenticación con `Authorization: Bearer <token>`.

### Recursos principales

- `/api/afiliados`
- `/api/proveedores`
- `/api/planes`
- `/api/polizas`
- `/api/reclamos`
- `/api/autorizaciones`
- `/api/servicios`
- `/api/pagos`
- `/api/facturas`
- `/api/notificaciones`

### Operaciones de negocio

- `/api/autorizaciones/:id/aprobar`
- `/api/autorizaciones/:id/rechazar`
- `/api/facturas/generar`
- `/api/facturas/:id/pagar`
- `/api/facturas/:id/recordatorio`
- `/api/facturas/:id/gracia`
- `/api/facturas/:id/suspender`

## Pruebas

Para test de carga con K6, consulta el README del directorio K6:

```bash
./k6/README.md
```
