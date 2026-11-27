const express = require("express");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({
      ok: true,
      mensaje: "Backend de Brasa Urbana funcionando 🍔",
    });
  });

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, () => {
    console.log(`Servidor disponible en http://localhost:${port}`);
  });
}

module.exports = createApp;
