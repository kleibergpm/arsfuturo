# Backend ARS Futuro

API REST MVC con Express, Prisma y PostgreSQL. La documentación interactiva estará disponible en `http://localhost:4000/api/docs`.

## Instalación local

1. Cree la base de datos: `createdb ars_futuro`.
2. Copie `.env.example` a `.env` y ajuste usuario, contraseña y `JWT_SECRET`.
3. Ejecute `npm install`, `npm run prisma:migrate` y `npm run prisma:seed`.
4. Inicie con `npm run dev`.

Los datos iniciales incluyen `admin/admin123`, `agente/agente123` y `supervisor/super123`. Cámbielos antes de usar el sistema fuera de desarrollo.

## API

Todos los endpoints, salvo `POST /api/auth/login` y `/health`, requieren `Authorization: Bearer <token>`.

- Recursos: `/api/afiliados`, `/api/proveedores`, `/api/planes`, `/api/polizas`, `/api/reclamos`, `/api/autorizaciones`, `/api/servicios`, `/api/pagos`, `/api/facturas`, `/api/notificaciones`.
- Operaciones de negocio: autorizaciones `/:id/aprobar|rechazar`, facturas `/generar`, `/:id/pagar|recordatorio|gracia|suspender`, y pagos `POST /api/pagos`.
