import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
  const { domain } = req.body;
  const reportsDir = path.resolve(process.cwd(), '.unlighthouse');

  // Función para buscar recursivamente archivos JSON en un directorio y subdirectorios
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

  // Variables para acumular los scores y contar cuántos archivos tienen cada métrica
  let performanceSum = 0, performanceCount = 0;
  let seoSum = 0, seoCount = 0;
  let accessibilitySum = 0, accessibilityCount = 0;
  let bestPracticesSum = 0, bestPracticesCount = 0;

  jsonFiles.forEach(file => {
    try {
      const data = fs.readFileSync(file, 'utf8');
      const report = JSON.parse(data);
      if (report.categories) {
        if (report.categories.performance?.score != null) {
          performanceSum += report.categories.performance.score;
          performanceCount++;
        }
        if (report.categories.seo?.score != null) {
          seoSum += report.categories.seo.score;
          seoCount++;
        }
        if (report.categories.accessibility?.score != null) {
          accessibilitySum += report.categories.accessibility.score;
          accessibilityCount++;
        }
        if (report.categories['best-practices']?.score != null) {
          bestPracticesSum += report.categories['best-practices'].score;
          bestPracticesCount++;
        }
      }
    } catch (error) {
      console.error("Error al procesar el archivo:", file, error);
    }
  });

  // Verificamos que al menos alguna métrica se haya encontrado
  if (performanceCount === 0 && seoCount === 0 && accessibilityCount === 0 && bestPracticesCount === 0) {
    return res.status(404).json({ error: "No se encontraron métricas válidas en los archivos JSON" });
  }

  // Calculamos el promedio de cada métrica (o null si no se encontró)
  const metrics = [
    { name: 'Performance', score: performanceCount ? performanceSum / performanceCount : null },
    { name: 'SEO', score: seoCount ? seoSum / seoCount : null },
    { name: 'Accesibilidad', score: accessibilityCount ? accessibilitySum / accessibilityCount : null },
    { name: 'Buenas Prácticas', score: bestPracticesCount ? bestPracticesSum / bestPracticesCount : null },
  ];

  return res.json({ domain, metrics });
});

app.listen(5000, () => {
  console.log("Servidor corriendo en el puerto 5000");
});
