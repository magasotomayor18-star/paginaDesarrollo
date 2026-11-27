const express = require("express");

const app = express();
const PORT = 3000;

// Permite recibir datos en formato JSON.
app.use(express.json());

// Ruta para comprobar que el backend funciona.
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    mensaje: "Backend de Brasa Urbana funcionando 🍔",
  });
});

// Inicia el servidor.
app.listen(PORT, () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});
