
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Iniciando montaje de la aplicación...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No se pudo encontrar el elemento root para montar la app");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Aplicación montada con éxito");
} catch (error) {
  console.error("Error durante el renderizado inicial:", error);
}
