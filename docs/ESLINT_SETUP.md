# Instalación y configuración de ESLint en el proyecto

Este documento explica cómo instalar y configurar ESLint en el backend y el frontend del proyecto.

## 1. Requisitos previos

- Node.js instalado
- npm disponible
- Tener la carpeta del proyecto descargada localmente

## 2. Importante: conflicto de versiones

Durante la instalación se puede dar este conflicto:

- El frontend llevaba `eslint@10.x`
- `eslint-plugin-jsx-a11y` exige versiones de ESLint compatibles con `^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9`

Por eso, para este proyecto la solución recomendada es usar ESLint `9.39.5` en el frontend y mantener la versión actual del backend si ya está funcionando con la config adecuada.

---

## 3. Backend

### 3.1. Ir a la carpeta del backend

```bash
cd C:\Users\Anderson\OneDrive\Escritorio\arsfuturo\arsfuturo\backend
```

### 3.2. Instalar dependencias base

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-security eslint-plugin-sonarjs eslint-plugin-n
```

Si ya están instaladas, no hace falta volver a instalarlas.

### 3.3. Añadir scripts en package.json

En [backend/package.json](../backend/package.json), asegúrate de tener estos scripts:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "start": "tsx src/server.ts",
  "typecheck": "tsc --noEmit",
  "lint": "eslint . --ext .ts,.js",
  "lint:fix": "eslint . --ext .ts,.js --fix",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "prisma db seed",
  "test": "vitest run"
}
```

### 3.4. Crear la configuración de ESLint

Crea el archivo `eslint.config.mjs` dentro de la carpeta backend con este contenido:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'k6/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      'no-console': 'warn',
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  }
);
```

### 3.5. Ejecutar ESLint

```bash
npm run lint
```

Y para corregir automáticamente:

```bash
npm run lint:fix
```

---

## 4. Frontend

### 4.1. Ir a la carpeta del frontend

```bash
cd C:\Users\Anderson\OneDrive\Escritorio\arsfuturo\arsfuturo\FrontEnd
```

### 4.2. Instalar dependencias compatibles

```bash
npm install -D @eslint/js@^9.39.5 eslint@^9.39.5 typescript-eslint@^8.70.0 eslint-plugin-react@^7.16.0 eslint-plugin-react-hooks@^5.1.0 eslint-plugin-jsx-a11y@^6.10.2 eslint-plugin-react-refresh@^0.4.0
```

### 4.3. Añadir scripts en package.json

En [FrontEnd/package.json](../FrontEnd/package.json), asegúrate de tener esto:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ext .ts,.tsx",
  "lint:fix": "eslint . --ext .ts,.tsx --fix",
  "preview": "vite preview"
}
```

### 4.4. Crear la configuración de ESLint

Crea `eslint.config.mjs` dentro de la carpeta frontend con este contenido:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'react-refresh': reactRefresh
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
);
```

### 4.5. Ejecutar ESLint

```bash
npm run lint
```

Y para auto-corregir:

```bash
npm run lint:fix
```

---

## 5. Recomendación final

Para este proyecto, usa:

- Backend: `eslint` con reglas de TypeScript y Node
- Frontend: `eslint` + React + a11y + hooks

Evita mezclar dependencias incompatible entre ambos lados. La mezcla más segura es usar ESLint 9 en el frontend y mantener la config actual del backend.

---

## 6. Detección rápida de errores comunes

Si aparece el error:

```bash
ERESOLVE unable to resolve dependency tree
```

entonces hay conflicto de versiones. La solución correcta es usar una versión compatible, no forzar con `--legacy-peer-deps` salvo que sea temporal.

---

## 7. Verificación

Después de la instalación, puedes comprobar que todo funciona con:

```bash
npm run lint
```

Si el proyecto tiene errores de código, ESLint te mostrará los archivos y líneas exactas que corregir. Eso es normal; el objetivo es detectar problemas antes de integrar cambios.
