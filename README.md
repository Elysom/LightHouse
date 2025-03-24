## 1\. Introducción

Este proyecto es una aplicación web que analiza el rendimiento, accesibilidad, buenas prácticas y SEO de un dominio utilizando la herramienta **Unlighthouse**. La aplicación consta de un **frontend** desarrollado con **React y TailwindCSS**, y un **backend** en **Node.js con Express.js** que ejecuta Unlighthouse para procesar los datos.

## 2\. Arquitectura del Proyecto

La aplicación se divide en dos partes principales:

### 2.1. Frontend

* **Framework:** React con Vite
* **Estilos:** TailwindCSS
* **Gráficos:** Recharts

### 2.2. Backend

* **Entorno:** Node.js
* **Framework:** Express.js
* **Comando ejecutado:** `npx unlighthouse --site <dominio>`
* **Formato de respuesta:** JSON con métricas de Unlighthouse

## 3\. Funcionalidades

### 3.1. Flujo de trabajo

1. El usuario ingresa un dominio en el campo de texto.
2. Al hacer clic en "Analizar", la solicitud es enviada al backend.
3. El backend ejecuta Unlighthouse y devuelve los resultados en formato JSON.
4. El frontend muestra los datos en gráficos de barras con Recharts.

### 3.2. Componentes del Frontend

* **Formulario de entrada:** Input de texto y botón para enviar la solicitud.
* **Indicador de carga:** Muestra un mensaje mientras se realiza el análisis.
* **Visualización de resultados:** Gráficos de barras con las métricas obtenidas.

## 4\. Instalación y Configuración

### 4.1. Requisitos

* Node.js instalado
* npm o como gestor de paquetes

### 4.2. Instalación

#### 1\. instalacion de vite:

```javascript
npm create vite@latest --template react
```

#### 2\. Instalación del frontend

```javascript
npm install
```

#### 3\. Instalación de TailwindCSS:

```
npm install tailwindcss @tailwindcss/vite
```

#### 4\. Configurar `tailwind`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),    tailwindcss()  ],
  
})
```

#### 5\. Instalación de Recharts:

```
npm install recharts
```

#### 6\. Ejecutar el frontend:

```
npm run dev
```

## 5\. Ejecutar el Servidor:

1. Irse a src/back
2. Ejecutar: **node server.js**
3. Tambien tenemos en la carpeta back el obtener.js
4. Hacemos tambien ejecutamos **node obtener.js** ( esto nos permite pintar la informacion que queremos de Unligthouse )

## 6\. Uso de la Aplicación

1. Ingresar un dominio en el input.
2. Hacer clic en el botón "Analizar".
3. Esperar a que los datos sean procesados.
4. Visualizar los resultados en los gráficos generados.

## 7\. Despliegue

Para desplegar la aplicación, se pueden utilizar:

* **Frontend:** Vercel o Netlify
* **Backend:** Render

## 8\. Seguridad y Consideraciones Finales

* Validar que los dominios ingresados sean correctos.
* Manejo de errores en caso de fallos en Unlighthouse.
