
# ARS Futuro - Guía de Instalación y Ejecución

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

---

## 📋 Descripción

Este repositorio contiene la aplicación **ARS Futuro**, un proyecto web desarrollado con **Vite** y **Node.js**.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:
- [Node.js](https://nodejs.org/) (versión LTS recomendada, incluye `npm`).
- [Git](https://git-scm.com/) (opcional, para clonar el repositorio).
- Un editor de código como [Visual Studio Code](https://code.visualstudio.com/).

---

## ⚠️ Solución Prevención de Errores en Windows (PowerShell)

Si usas Windows y la consola te muestra un error sobre la ejecución de scripts bloqueados (`ps1` script execution policy), ejecuta este comando en la terminal **PowerShell** antes de continuar:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
*(Presiona `Y` y luego Enter cuando te pregunte si confirmas el cambio).*

---

## 🚀 Pasos para Instalar y Ejecutar la Aplicación

### 1. Obtener el Proyecto
Clona el repositorio o descárgalo y descomprímelo en tu equipo:
```bash
git clone <URL_DEL_REPOSITORIO>
```
Navega hasta la carpeta raíz del proyecto:
```bash
cd ARSFuturo-main
```

---

### 2. Instalar Dependencias
Instala los paquetes de Node.js necesarios ejecutando:
```bash
npm install
```

---

### 3. Ejecutar en Modo Desarrollo
Para iniciar el servidor local de desarrollo con Vite, ejecuta:
```bash
npm run dev
```

Una vez iniciada la aplicación, la terminal te indicará la URL local para acceder desde el navegador (por defecto):
👉 **http://localhost:5173/**

---

## 🛠️ Comandos Útiles

| Comando | Descripción |
| :--- | :--- |
| `npm install` | Instala todas las dependencias declaradas en el `package.json`. |
| `npm run dev` | Inicia el servidor local de desarrollo con recarga rápida (HMR). |
| `npm run build` | Compila y genera los archivos optimizados para producción en la carpeta `dist/`. |
| `npm run preview` | Permite previsualizar la build de producción de forma local. |

---

## 💡 Notas Adicionales
- Para detener el servidor de desarrollo en la terminal, presiona `Ctrl + C`.
- Si experimentas advertencias de paquetes obsoletos en Vite, puedes actualizar dependencias dev con `npm i <paquete>@latest -D`.


# ARS Salud · Demo (React + Vite + Tailwind)

## Requisitos
- Node.js 18+

## Instalación
```bash
npm install
npm run dev
```

## Dependencias principales
- React, Vite
- TailwindCSS
- framer-motion
- lucide-react
- recharts
