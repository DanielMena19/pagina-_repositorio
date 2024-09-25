const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta assets
app.use(express.static(path.join(__dirname, 'assets')));

// Ruta para servir `login.html` cuando el usuario acceda a `/`
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Ruta para `login.html` de forma explícita (opcional)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Ruta para `inicio.html` (por ejemplo, después del login)
app.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'inicio.html'));
});

// Iniciar el servidor en el puerto 8080
const port = 8080;
app.listen(port, () => {
  console.log(`Servidor del frontend corriendo en http://localhost:${port}`);
});
