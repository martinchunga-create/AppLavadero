
# 📊 Dashboard de Control de Stock de Prendas

Este dashboard permite a la dirección visualizar en tiempo real el estado del inventario basado en planillas de Excel.

## 🚀 Cómo publicar esta App (Para que otros la vean)

### Opción A: Despliegue en la Nube (Recomendado para Directores)
1. Sube estos archivos a un repositorio en **GitHub**.
2. Entra en [Vercel](https://vercel.com/) o [Netlify](https://www.netlify.com/).
3. Conecta tu repositorio.
4. ¡Listo! Obtendrás un link público (ej. `https://mi-inventario.vercel.app`).

### Opción B: Ejecución Local en tu PC
1. Asegúrate de tener instalado [Node.js](https://nodejs.org/).
2. En la carpeta del proyecto, abre una terminal y escribe:
   ```bash
   npx serve .
   ```
3. Abre tu navegador en `http://localhost:3000`.

## 📁 Formato del Excel Sugerido
Para que la app funcione correctamente, el archivo Excel debe contener las siguientes columnas (el sistema es flexible con los nombres):
- **Evento**: (Ej: "CANTIDAD IDEAL / DIA", "INVENTARIO ENERO")
- **Detalle**: (Ej: "Lectura Sanatorio", "Compras")
- **Prenda**: (Nombre del artículo)
- **Cantidad**: (Valor numérico)

## 🛠️ Tecnologías utilizadas
- **React 19** (Frontend)
- **Tailwind CSS** (Diseño)
- **Recharts** (Gráficos interactivos)
- **SheetJS (XLSX)** (Procesamiento de datos local)

---
*Desarrollado para optimizar la toma de decisiones operativa.*
