import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
  const { domain } = req.body;
  const reportsDir = path.resolve(process.cwd(), '.unlighthouse');

  const findJsonFiles = (dir) => {
    let results = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        results = results.concat(findJsonFiles(itemPath));
      } else if (stats.isFile() && item.endsWith('.json')) {
        results.push(itemPath);
      }
    }
    return results;
  };

  const jsonFiles = findJsonFiles(reportsDir);
  if (jsonFiles.length === 0) {
    return res.status(404).json({ error: "No se encontraron archivos JSON en .unlighthouse" });
  }

  let metrics = null;
  for (const file of jsonFiles) {
    try {
      const data = fs.readFileSync(file, 'utf8');
      const report = JSON.parse(data);
      if (report.categories) {
        metrics = [
          { name: 'Performance', score: report.categories.performance?.score },
          { name: 'SEO', score: report.categories.seo?.score },
          { name: 'Accesibilidad', score: report.categories.accessibility?.score },
          { name: 'Buenas Prácticas', score: report.categories['best-practices']?.score }
        ];
        break;
      }
    } catch (error) {
      console.error("Error al procesar el archivo:", file, error);
    }
  }

  if (!metrics) {
    return res.status(404).json({ error: "No se encontraron métricas válidas en los archivos JSON" });
  }

  return res.json({
    domain,
    metrics
  });
});

app.listen(5000, () => {
  console.log("Servidor corriendo en el puerto 5000");
});
