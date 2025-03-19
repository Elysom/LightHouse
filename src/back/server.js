import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 5000;

// Configuración de CORS y middleware para analizar JSON
app.use(cors());
app.use(bodyParser.json());

// Ruta para recibir el análisis del dominio
app.post('/analyze', (req, res) => {
  const { domain } = req.body;
  
  if (!domain) {
    return res.status(400).json({ error: 'El dominio es requerido' });
  }

  console.log(`Recibiendo solicitud para analizar el dominio: ${domain}`);

  // Ejecutar el comando Unlighthouse
  exec(`npx unlighthouse --site ${domain} --output json --save false`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar Unlighthouse: ${error.message}`);
      return res.status(500).json({ error: 'Error al ejecutar el análisis' });
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: 'Error en el análisis' });
    }

    console.log('Análisis completado exitosamente.');

    // Definir la ruta de la carpeta .unlighthouse
    const reportsDir = path.resolve(process.cwd(), '.unlighthouse');

    // Función para buscar recursivamente archivos JSON en un directorio y sus subdirectorios
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
      return res.status(500).json({ error: 'No se encontraron archivos JSON en .unlighthouse' });
    }

    // Leer el primer archivo JSON encontrado (puedes ajustar para combinar resultados de varios archivos si es necesario)
    fs.readFile(jsonFiles[0], 'utf8', (err, data) => {
      if (err) {
        console.error('Error leyendo el archivo:', jsonFiles[0], err);
        return res.status(500).json({ error: 'Error leyendo el archivo JSON' });
      }

      try {
        const report = JSON.parse(data);
        // Se asume que la estructura del JSON tiene una key "categories" con las métricas
        const metrics = [
          { name: 'Rendimiento', score: report.categories?.performance?.score },
          { name: 'Accesibilidad', score: report.categories?.accessibility?.score },
          { name: 'Buenas prácticas', score: report.categories?.['best-practices']?.score },
          { name: 'SEO', score: report.categories?.seo?.score },
        ];

        // Se envían los resultados al frontend con la estructura esperada
        res.json({ domain, metrics });
      } catch (error) {
        console.error('Error al procesar el JSON:', error);
        res.status(500).json({ error: 'Error al procesar los resultados' });
      }
    });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
