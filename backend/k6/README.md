# K6 tests

Este directorio contiene una base de pruebas de carga y smoke para los endpoints del backend.

## Precondiciones

Antes de ejecutar cualquier prueba debes tener lo siguiente:

- Node.js y npm instalados en tu sistema.
- El backend instalado y sus dependencias presentes:

```bash
cd backend
npm install
```

- El backend levantado y escuchando en `http://localhost:4000`:

```bash
cd backend
npm run dev
```

- K6 instalado en tu máquina: https://k6.io/docs/get-started/installation/
- Credenciales válidas del API o valores por defecto del proyecto (`admin` / `admin123`)

> Si la API no está levantada, las pruebas fallan con `dial tcp 127.0.0.1:4000 ... connectex: No connection could be made`.

## Variables de entorno

### PowerShell

```powershell
$env:BASE_URL = 'http://localhost:4000'
$env:API_USER = 'admin'
$env:API_PASSWORD = 'admin123'
```

### Bash / zsh

```bash
export BASE_URL=http://localhost:4000
export API_USER=admin
export API_PASSWORD=admin123
```

## Ejecutar pruebas

Desde la raíz del proyecto, o desde la carpeta del backend si prefieres:

```bash
cd backend
k6 run k6/auth-smoke.js
k6 run k6/crud-endpoints.js
k6 run k6/business-endpoints.js
```

## Qué validan los tests

- `auth-smoke.js`: login y acceso a `/api/auth/me`
- `crud-endpoints.js`: creación y listado de recursos principales como planes, proveedores, afiliados y reclamos
- `business-endpoints.js`: flujo de negocio con autorizaciones, servicios, pagos, facturación y dashboard

## Cambios recientes

- Se corrigió la configuración de `vus` / `iterations` para evitar errores de escenario en K6.
- Se añadieron validaciones simples y legibles con `check()` para verificar:
  - códigos HTTP esperados
  - presencia de token o payload válido
  - estructuras JSON esperadas (arreglos y objetos)
- Se documentó la forma correcta de ejecutar K6 sin depender de rutas personales del equipo.

> Estas validaciones están pensadas para ser claras y fáciles de depurar, sin añadir complejidad innecesaria a la ejecución.
