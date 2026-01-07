import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Intentando montar App...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App montada correctamente.");
  } catch (err) {
    console.error("Fallo al montar React:", err);
    container.innerHTML = `<div style="padding:20px; color:red;">Error al iniciar React: ${err.message}</div>`;
  }
} else {
  console.error("No se encontró el elemento #root en el DOM.");
}
