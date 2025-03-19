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
    return res.status(400).json({ error: 'El dominio es requerido'});
  }

  console.log(`Recibiendo solicitud para analizar el dominio: ${domain}`);

  const childProcess = exec(`npx unlighthouse --site ${domain} --save false`);
  let output = '';
  let responseSent = false; // Para asegurarnos de enviar la respuesta solo una vez

  // Escuchar la salida estándar
  childProcess.stdout.on('data', (data) => {
    output += data;
    console.log(data);

    // Verificar si se ha impreso el mensaje de finalización
    if (!responseSent && data.includes('Unlighthouse has finished scanning')) {
      responseSent = true;
      console.log('Mensaje final detectado. Análisis completado.');
      const { domain } = req.body;
      const reportsDir = path.resolve(process.cwd(), '.unlighthouse');
    
      // Función para buscar archivos JSON en subdirectorios
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
    
      const reportResults = [];
    
      jsonFiles.forEach(file => {
        try {
          const data = fs.readFileSync(file, 'utf8');
          const report = JSON.parse(data);
    
          if (report.categories) {
            const metrics = [
              { name: 'Performance', score: report.categories.performance?.score ?? "N/A" },
              { name: 'SEO', score: report.categories.seo?.score ?? "N/A" },
              { name: 'Accesibilidad', score: report.categories.accessibility?.score ?? "N/A" },
              { name: 'Buenas Prácticas', score: report.categories['best-practices']?.score ?? "N/A" },
            ];
    
            // Obtener nombre de la carpeta padre
            const parentFolder = path.basename(path.dirname(file));
    
            console.log(`Archivo procesado: ${file}`);
            console.log(`Carpeta padre: ${parentFolder}`); 
    
            reportResults.push({
              folder: parentFolder || "Desconocido",
              metrics,
            });
          }
        } catch (error) {
          console.error("Error al procesar el archivo:", file, error);
        }
      });
    
      if (reportResults.length === 0) {
        return res.status(404).json({ error: "No se encontraron métricas válidas en los archivos JSON" });
      }
    
      return res.json({ domain, reports: reportResults });
    }
  });

  // Manejo de errores en stderr
  childProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Opcionalmente, si el proceso termina y no se ha detectado el mensaje final
  childProcess.on('close', (code) => {
    console.log(`Proceso finalizó con el código ${code}`);
    if (!responseSent) {
      res.json({ result: output, exitCode: code });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
