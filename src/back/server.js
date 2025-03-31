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

  const reportsDir = path.resolve(process.cwd(), '../../public/lighthouse');

  // Servir la carpeta public
  app.use(express.static(path.resolve(process.cwd(), '../../public/lighthouse')));

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

  const ejecutar = exec(`npx unlighthouse --site ${dominio} --output-path ../../public/lighthouse --host ${HOST} --save false`);
  let output = '';
  let respuestaEnviada = false;

  // Escuchar la salida
  ejecutar.stdout.on('data', (datos) => {
    output += datos;

    if (!respuestaEnviada && datos.includes('Unlighthouse has finished scanning')) {
      respuestaEnviada = true;
      console.log('Mensaje final detectado. Análisis completado.');

      // Función recursiva para buscar archivos JSON en subdirectorios
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
      
      res.json({ domain: dominio, reports: resultadosObtenidos });
    }
  });

  ejecutar.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ejecutar.on('close', (code) => {
    console.log(`El proceso finalizó con el siguiente código ${code}`);
    if (!respuestaEnviada) {
      res.json({ result: output, exitCode: code });
    }
  });
});

//  endpoint para encontrar el archivo lighthouse.html
app.get('/api/encontrar-unlighthouse', (req, res) => {
  try {
    const publicFolder = path.resolve(process.cwd(), '../../public/lighthouse');
    const encontrarUnlighthouseHtml = (directorio) => {
      let resultados = [];
      const elementos = fs.readdirSync(directorio);
      for (const elemento of elementos) {
        const rutaElemento = path.join(directorio, elemento);
        const stats = fs.statSync(rutaElemento);
        if (stats.isDirectory()) {
          resultados = resultados.concat(encontrarUnlighthouseHtml(rutaElemento));
        } else if (stats.isFile() && elemento === "lighthouse.html") {
          resultados.push(rutaElemento);
        }
      }
      return resultados;
    };

    const resultados = encontrarUnlighthouseHtml(publicFolder);
    if (resultados.length > 0) {
      const filePath = resultados[0];
      // Se remueve la parte de la ruta correspondiente a la carpeta public
      const relativePath = filePath.replace(publicFolder, '');
      res.json({ url: relativePath });
    } else {
      res.status(404).json({ error: "Archivo unlighthouse.html no encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(puerto, () => {
  console.log(`El servidor está escuchando en http://localhost:${puerto}`);
});
