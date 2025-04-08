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
console.log("holamundo");

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

  // Definición del mapeo para traducción de categorías
  const mapeoCategorias = {
    performance: 'Rendimiento',
    accessibility: 'Accesibilidad',
    'best-practices': 'Buenas Prácticas',
    seo: 'SEO'
  };

  // Escuchar la salida
  ejecutar.stdout.on('data', (datos) => {
    output += datos;

    if (!respuestaEnviada && datos.includes('Unlighthouse has finished scanning')) {
      respuestaEnviada = true;
      console.log('Mensaje final detectado. Análisis completado.');

      // Función recursiva para buscar archivos JSON en subdirectorios
      const encontrarJsons = (dir) => {
        let resultados = [];
        const elementos = fs.readdirSync(dir);
        for (const elemento of elementos) {
          const rutaElemento = path.join(dir, elemento);
          const stats = fs.statSync(rutaElemento);
          if (stats.isDirectory()) {
            resultados = resultados.concat(encontrarJsons(rutaElemento));
          } else if (stats.isFile() && elemento.endsWith('.json')) {
            resultados.push(rutaElemento);
          }
        }
        return resultados;
      };

      const archivosJson = encontrarJsons(reportsDir);
      if (archivosJson.length === 0) {
        return res.status(404).json({ error: "No se encontró ningún archivo JSON en .unlighthouse" });
      }

      // Procesar los archivos JSON encontrados
      const resultadosObtenidos = [];
      const auditsScoreCero = []; // Aquí se almacenarán los audits con score 0

      archivosJson.forEach(file => {
        try {
          const datosArchivo = fs.readFileSync(file, 'utf8');
          const dataJson = JSON.parse(datosArchivo);

          // Se obtiene la sección de categorías; se intenta con "categories" o "reportCategories"
          const seccionCategorias = dataJson.categories || dataJson.reportCategories;

          // Procesar métricas basadas en categorías de forma dinámica
          if (seccionCategorias) {
            const clavesCategorias = Object.keys(seccionCategorias);
            const metricas = clavesCategorias.map(cat => {
              const score = seccionCategorias[cat].score ?? "N/A";
              return {
                name: mapeoCategorias[cat] || cat,
                score: score
              };
            });
            const carpetaPadre = path.basename(path.dirname(file));
            resultadosObtenidos.push({
              folder: carpetaPadre || "Desconocido",
              metrics: metricas,
            });
          }

          // Extraer los elementos dentro de "audits" que tengan score igual a 0
          if (dataJson.audits) {
            for (const key in dataJson.audits) {
              const audit = dataJson.audits[key];
              if (typeof audit.score === 'number' && audit.score === 0) {
                // Buscar la categoría a la que pertenece la auditoría mediante auditRefs dentro de la sección de categorías
                let categoriaEncontrada = null;
                if (seccionCategorias) {
                  for (const cat in seccionCategorias) {
                    if (
                      seccionCategorias[cat].auditRefs &&
                      Array.isArray(seccionCategorias[cat].auditRefs) &&
                      seccionCategorias[cat].auditRefs.some(ref => ref.id === key)
                    ) {
                      categoriaEncontrada = cat;
                      break;
                    }
                  }
                }
                // Verificar si ya existe un audit con el mismo title y agregar la categoría correspondiente
                if (!auditsScoreCero.some(item => item.title === audit.title)) {
                  auditsScoreCero.push({
                    file: file,
                    id: key,
                    title: audit.title,
                    score: audit.score,
                    category: categoriaEncontrada
                      ? (mapeoCategorias[categoriaEncontrada] || categoriaEncontrada)
                      : "Desconocido"
                  });
                }
              }
            }
          }

        } catch (error) {
          console.error("Error al procesar el archivo:", file, error);
        }
      });

      // Mostrar en consola el contenido de auditsScoreCero
      console.log('Audits con score 0:', auditsScoreCero);

      if (resultadosObtenidos.length === 0) {
        return res.status(404).json({ error: "No se encontraron métricas válidas en los archivos JSON" });
      }
      // Enviar respuesta para el cliente, incluyendo también los audits con score 0 y su categoría
      res.json({ domain: dominio, reports: resultadosObtenidos, auditsScoreCero });
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

// Escuchando en el puerto del cliente
app.listen(puertoCliente, () => {
  console.log(`El servidor está escuchando en http://localhost:${puertoCliente}`);
});
