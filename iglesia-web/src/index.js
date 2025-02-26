import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { onCLS } from 'web-vitals'; // Importar la función onCLS en lugar de getCLS


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Suscribirse a las métricas utilizando onCLS
onCLS((metric) => {
  console.log(metric);  // Procesar la métrica de CLS
});
