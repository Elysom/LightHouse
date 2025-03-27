import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || "5678";

const app = express();
const puerto = 5000;

// Configuración de CORS y middleware para analizar JSON
app.use(cors());
app.use(bodyParser.json());

// Ruta para recibir el análisis del dominio
app.post('/analizar', (req, res) => {
  const { domain: dominio } = req.body;

  if (!dominio) {
    return res.status(400).json({ error: 'Se necesita un dominio' });
  }

  console.log(`Se ha recibido una solicitud para analizar el siguiente dominio: ${dominio}`);

  const reportsDir = path.resolve(process.cwd(), '.unlighthouse');

  // Comprobamos si la carpeta .unlighthouse existe y la eliminamos
  if (fs.existsSync(reportsDir)) {
    fs.rm(reportsDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`Error al eliminar la carpeta ${reportsDir}:`, err);
      } else {
        console.log(`Carpeta ${reportsDir} eliminada correctamente.`);
      }
    });
  }

  const ejecutar = exec(`npx unlighthouse --site ${dominio} --server-port 7777 --host ${HOST} --save false`);
  let output = '';
  let respuestaEnviada = false;

  // Escuchar la salida
  ejecutar.stdout.on('data', (datos) => {
    output += datos;

    // Verificar si se ha impreso el mensaje de finalización
    if (!respuestaEnviada && datos.includes('Unlighthouse has finished scanning')) {
      respuestaEnviada = true;
      console.log('Mensaje final detectado. Análisis completado.');

      // Función para buscar archivos JSON en los subdirectorios
      const encontrarJsons = (dir) => {
        let resultados = [];
        const jsons = fs.readdirSync(dir);
        for (const json of jsons) {
          const rutaJson = path.join(dir, json);
          const ruta = fs.statSync(rutaJson);
          if (ruta.isDirectory()) {
            resultados = resultados.concat(encontrarJsons(rutaJson));
          } else if (ruta.isFile() && json.endsWith('.json')) {
            resultados.push(rutaJson);
          }
        }
        return resultados;
      };

      const archivoJson = encontrarJsons(reportsDir);
      if (archivoJson.length === 0) {
        return res.status(404).json({ error: "No se encontró ningún archivo JSON en .unlighthouse" });
      }

      const resultadosObtenidos = [];

      archivoJson.forEach(file => {
        try {
          const datos = fs.readFileSync(file, 'utf8');
          const puntuacion = JSON.parse(datos);

          if (puntuacion.categories) {
            const metricas = [
              { name: 'Rendimiento', score: puntuacion.categories.performance?.score ?? "N/A" },
              { name: 'Accesibilidad', score: puntuacion.categories.accessibility?.score ?? "N/A" },
              { name: 'Buenas Prácticas', score: puntuacion.categories['best-practices']?.score ?? "N/A" },
              { name: 'SEO', score: puntuacion.categories.seo?.score ?? "N/A" },
            ];

            // Obtener el nombre de la carpeta padre
            const carpetaPadre = path.basename(path.dirname(file));
        
            resultadosObtenidos.push({
              folder: carpetaPadre || "Desconocido",
              metrics: metricas,
            });
          }
        } catch (error) {
          console.error("Error al procesar el archivo:", file, error);
        }
      });

      if (resultadosObtenidos.length === 0) {
        return res.status(404).json({ error: "No se encontraron métricas válidas en los archivos JSON" });
      }
      
      // Enviar respuesta con los resultados
      res.json({ domain: dominio, reports: resultadosObtenidos });
    }
  });

  // Manejo de errores en stderr
  ejecutar.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Por si el proceso termina y no se detecta un mensaje final
  ejecutar.on('close', (code) => {
    console.log(`El proceso finalizó con el siguiente código ${code}`);
    if (!respuestaEnviada) {
      res.json({ result: output, exitCode: code });
    }
  });
});

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`El servidor está escuchando en http://localhost:${puerto}`);
});