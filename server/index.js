import express from "express";
import { pathToFileURL } from "node:url";

export function createApp() {
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, () => {
    console.log(`Servidor disponible en http://localhost:${port}`);
  });
}
