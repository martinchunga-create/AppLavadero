import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("🚀 Sistema: Iniciando transpilación y montaje...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ Sistema: Dashboard cargado con éxito.");
  } catch (err) {
    console.error("❌ Error en el renderizado de React:", err);
    container.innerHTML = `
      <div style="padding:40px; font-family:sans-serif; text-align:center;">
        <h2 style="color:#e11d48;">Error al iniciar la aplicación</h2>
        <p style="color:#64748b;">${err.message}</p>
        <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer;">
          Reintentar Carga
        </button>
      </div>
    `;
  }
} else {
  console.error("No se encontró el contenedor #root");
}
