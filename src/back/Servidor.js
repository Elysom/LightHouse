import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const HOST = process.env.HOST || "0.0.0.0";
const app = express();
const puertoCliente = 5000;

// Configuración de CORS y middleware para analizar JSON
app.use(cors());
app.use(bodyParser.json());

// Función para verificar si un dominio es accesible
const verificarDominioExistente = async (url) => {
  try {
    const response = await axios.head(url); // Enviar solicitud HEAD
    return response.status === 200; // Verificar que el dominio está accesible
  } catch (error) {
    return false; // Si el dominio no responde o hay problemas de conexión
  }
};

// Ruta para verificar la existencia del dominio
app.post('/verificar-dominio', async (req, res) => {
  const { domain: dominio } = req.body;

  if (!dominio) {
    return res.status(400).json({ error: 'Se necesita un dominio' });
  }

  // Verificar si el dominio tiene un formato válido
  const regex = /^(https?:\/\/)/;
  if (!regex.test(dominio)) {
    return res.status(400).json({ error: 'El dominio debe empezar con http:// o https://' });
  }

  // Verificar si el dominio está accesible
  const existe = await verificarDominioExistente(dominio);
  if (!existe) {
    return res.status(404).json({ error: 'El dominio no existe o no es accesible.' });
  }

  res.json({ existe: true });
});

// Ruta para recibir el análisis del dominio
app.post('/analizar', (req, res) => {
  const { domain: dominio } = req.body;

  if (!dominio) {
    return res.status(400).json({ error: 'Se necesita un dominio' });
  }
  console.log(`Se ha recibido una solicitud para analizar el siguiente dominio: ${dominio}`);

  const reportsDir = path.resolve(process.cwd(), '../../public/lighthouse');
  // Servir en la carpeta public
  app.use(express.static(path.resolve(process.cwd(), '../../public/lighthouse')));

  // Comprobamos si hay datos antiguos en la carpeta lighthouse (public) y los eliminamos
  if (fs.existsSync(reportsDir)) {
    fs.rm(reportsDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`Error al eliminar la carpeta ${reportsDir}:`, err);
      } else {
        console.log(`Carpeta ${reportsDir} eliminada correctamente.`);
      }
    });
  }

  // Comando unlighthouse
  const ejecutar = exec(`npx unlighthouse --site ${dominio} --output-path ../../public/lighthouse --host ${HOST}`);
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

      // Procesar los archivos JSON encontrados y enviarlos como respuesta
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
      //Respuesta para el cliente
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

//Escuchando en el puerto del cliente
app.listen(puertoCliente, () => {
  console.log(`El servidor está escuchando en http://localhost:${puertoCliente}`);
});