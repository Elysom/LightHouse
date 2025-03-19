import fs from 'fs';
import path from 'path';

const reportsDir = path.resolve(process.cwd(), '.unlighthouse');

// Función para buscar recursivamente archivos JSON en un directorio y sus subdirectorios
const findJsonFiles = (dir) => {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      // Llamada recursiva para directorios hijos
      results = results.concat(findJsonFiles(itemPath));
    } else if (stats.isFile() && item.endsWith('.json')) {
      results.push(itemPath);
    }
  }
  return results;
};

const jsonFiles = findJsonFiles(reportsDir);

if (jsonFiles.length > 0) {
  jsonFiles.forEach((file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error('Error leyendo el archivo:', file, err);
        return;
      }

      try {
        const report = JSON.parse(data);
        console.log(`Archivo: ${file}`);
        console.log('Performance Score:', report.categories?.performance?.score);
        console.log('SEO Score:', report.categories?.seo?.score);
        console.log('Accesibilidad Score:', report.categories?.accessibility?.score);
        // Algunas herramientas usan "best-practices" como key; de lo contrario, ajustar según el JSON
        console.log('Buenas Prácticas Score:', report.categories?.['best-practices']?.score);
        console.log('----------------------------------------');
      } catch (error) {
        console.error('Error al parsear el JSON del archivo:', file, error);
      }
    });
  });
} else {
  console.error('No se encontraron archivos JSON en .unlighthouse');
}
