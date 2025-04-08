import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { calcularPromedio } from "../utiles/calcularPromedio.jsx";
import Grafica from "./Grafica.jsx";
import TarjetaEstadistica from "./TarjetaEstadistica.jsx";
import CodeButton from "./CodeButton.jsx";

function VistaResultadosPromedio({datos}) {
  
  const parametros = {
    "Rendimiento": "First Contentful Paint (FCP): el tiempo que tarda en aparecer el primer contenido en pantalla.\nSpeed Index (SI): el tiempo que tarda el contenido visible en aparecer en pantalla.\nTime to Interactive (TTI): el tiempo necesario para que el sitio web sea interactivo y responda a las acciones del usuario.",
    "Accesibilidad": "Contraste: comprueba si los colores de su sitio web tienen suficiente contraste para ser legibles por todos los usuarios.\nNavegación: comprueba si su sitio web es fácil de navegar utilizando un teclado y un lector de pantalla.\nContenido: comprueba si el contenido de su sitio web es accesible para todos los usuarios, incluidos aquellos con necesidades específicas de accesibilidad.",
    "Buenas Prácticas": "Uso de HTTPS: comprueba si su sitio web utiliza HTTPS para proteger los datos de los usuarios.\nOptimización de imágenes: comprueba si las imágenes de su sitio web están optimizadas para reducir el tiempo de carga.\nUso de fuentes web: comprueba si su sitio web utiliza fuentes web para mejorar la legibilidad y la velocidad de carga.",
    "SEO": "Metaetiquetas: comprueba si las metaetiquetas importantes están presentes en su sitio web, como la etiqueta de título, la etiqueta de descripción y la etiqueta viewport.\nEstructura del contenido: comprueba si el contenido de su sitio web está técnicamente optimizado para los motores de búsqueda.\nEnlaces: comprueba si los enlaces de su sitio web son funcionales y están optimizados para los motores de búsqueda.",
  };

  const promedios = [
    { name: "Rendimiento", score: calcularPromedio("Rendimiento", datos.reports) },
    { name: "Accesibilidad", score: calcularPromedio("Accesibilidad", datos.reports) },
    { name: "Buenas Prácticas", score: calcularPromedio("Buenas Prácticas", datos.reports) },
    { name: "SEO", score: calcularPromedio("SEO", datos.reports) },
  ];

  const auditsGrouped = useMemo(() => {
    if (!datos.auditsScoreCero) return {};
    return datos.auditsScoreCero.reduce((acc, audit) => {
      const cat = audit.category || "Desconocido";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(audit);
      return acc;
    }, {});
  }, [datos.auditsScoreCero]);

  // Estado de las categorías abiertas
  const [categoriasAbiertas, setCategoriasAbiertas] = useState([]);

  const toggleCategoria = (categoria) => {
    setCategoriasAbiertas((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria]
    );
  };

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold mb-6">Resumen de los subdominios</h2>
      <CodeButton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {promedios.map((m, i) => {
          const estaAbierta = categoriasAbiertas.includes(m.name);
          const auditoriasFallidas = auditsGrouped[m.name] || [];

          return (
            <motion.div key={i}>
              <TarjetaEstadistica
                nombre={m.name}
                score={m.score}
                descripcion={parametros[m.name]}
                auditorias={auditoriasFallidas}
                abierta={estaAbierta}
                onClick={() => toggleCategoria(m.name)} // Alterna la categoría abierta
              />
            </motion.div>
          );
        })}
      </div>

      <div className="report-card-promedios">
        <h3 className="report-subtitle">Gráfico de los promedios</h3>
        <Grafica datos={promedios} />
      </div>
    </div>
  );
}

export default VistaResultadosPromedio;