# FrontEnd ARS Futuro

Aplicación cliente en React + Vite + TypeScript para la gestión de afiliados, proveedores, autorizaciones, pagos y dashboard.

## Requisitos

- Node.js 20 o superior
- npm o pnpm
- Backend de la API ejecutándose en `http://localhost:4000`

## Instalación

Desde la carpeta del frontend:

```bash
cd FrontEnd
npm install
```

Si necesitas configurar variables de entorno, crea un archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Variables de entorno

Ejemplo de `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La app quedará disponible en:

- `http://localhost:5173`

## Build de producción

```bash
npm run build
```

Puedes previsualizar el build con:

```bash
npm run preview
```

## Scripts disponibles

- `npm run dev` — inicia Vite en modo desarrollo
- `npm run build` — compila la aplicación para producción
- `npm run preview` — sirve el build compilado localmente

## Dependencias del proyecto

El frontend usa:

- React
- Vite
- TypeScript
- Tailwind CSS

Asegúrate de que la API backend esté corriendo antes de realizar pruebas funcionales desde la interfaz.
