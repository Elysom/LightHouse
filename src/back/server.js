import express from "express";
import cors from "cors";
import { exec } from "node:child_process";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/analyze", (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: "Dominio requerido" });

  // Asegúrate de que el comando Lighthouse apunte al puerto correcto
  const command = `npx unlighthouse --site ${domain} --format json --port 5678`;

  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      return res.status(500).json({ error: error?.message || stderr });
    }

    try {
      const result = JSON.parse(stdout);
      const metrics = Object.entries(result.categories).map(([key, value]) => ({
        name: key,
        score: value.score * 100,
      }));

      res.json({ domain, metrics });
    } catch (parseError) {
      res.status(500).json({ error: "Error al procesar datos" });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
