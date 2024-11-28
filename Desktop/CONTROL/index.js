const express = require('express');
const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, bienvenido a la API!');
});

// Configuración del puerto
const port = 5000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
