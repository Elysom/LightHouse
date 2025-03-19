import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Importamos el paquete cors
import { exec } from 'child_process';

const app = express();
const port = 5000;

// Configurar CORS para permitir solicitudes de cualquier origen
app.use(cors());

// Middleware para analizar JSON
app.use(bodyParser.json());

// Ruta para recibir el análisis del dominio
app.post('/analyze', (req, res) => {
  const { domain } = req.body;

  // Validación del dominio
  if (!domain) {
    return res.status(400).json({ error: 'El dominio es requerido' });
  }

  console.log(`Recibiendo solicitud para analizar el dominio: ${domain}`);

  // Ejecutar el comando Unlighthouse para obtener los resultados
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
    try {
      // Procesamos los resultados (asumimos que Unlighthouse devuelve un JSON)
      const result = JSON.parse(stdout);

      // Formateamos los datos a la estructura que espera el frontend
      const metrics = [
        { name: 'Rendimiento', score: result.performance },
        { name: 'Accesibilidad', score: result.accessibility },
        { name: 'Buenas prácticas', score: result.best_practices },
        { name: 'SEO', score: result.seo },
      ];

      // Enviamos los resultados al frontend
      res.json({ domain, metrics });
    } catch (err) {
      console.error('Error al procesar el resultado de Unlighthouse:', err);
      res.status(500).json({ error: 'Error al procesar los resultados' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
