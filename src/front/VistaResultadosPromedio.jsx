import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { calcularPromedio } from "../utiles/calcularPromedio.jsx";
import Grafica from "./Grafica.jsx";
import TarjetaEstadistica from "./TarjetaEstadistica.jsx";
import CodeButton from "./CodeButton.jsx";

function VistaResultadosPromedio({ datos }) {
  // Se quitan los textos asignando cadenas vacías
  const parametros = {
    "Rendimiento": "",
    "Accesibilidad": "",
    "Buenas Prácticas": "",
    "SEO": "",
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
                onClick={() => toggleCategoria(m.name)}
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
