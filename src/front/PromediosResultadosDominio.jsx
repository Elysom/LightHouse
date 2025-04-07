import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";
import { calcularPromedio } from "../utiles/calcularPromedio.jsx";
import Grafica from "./Grafica.jsx";
import TarjetaEstadistica from "./TarjetaEstadistica.jsx";

function PromediosResultadosDominio({ datos }) {
  // Parámetros de cada métrica
  const parametros = {
    "Rendimiento": "First Contentful Paint (FCP): el tiempo que tarda en aparecer el primer contenido en pantalla.\nSpeed Index (SI): el tiempo que tarda el contenido visible en aparecer en pantalla.\nTime to Interactive (TTI): el tiempo necesario para que el sitio web sea interactivo y responda a las acciones del usuario.",
    "Accesibilidad": "Contraste: comprueba si los colores de su sitio web tienen suficiente contraste para ser legibles por todos los usuarios.\nNavegación: comprueba si su sitio web es fácil de navegar utilizando un teclado y un lector de pantalla.\nContenido: comprueba si el contenido de su sitio web es accesible para todos los usuarios, incluidos aquellos con necesidades específicas de accesibilidad.",
    "Buenas Prácticas": "Uso de HTTPS: comprueba si su sitio web utiliza HTTPS para proteger los datos de los usuarios.\nOptimización de imágenes: comprueba si las imágenes de su sitio web están optimizadas para reducir el tiempo de carga.\nUso de fuentes web: comprueba si su sitio web utiliza fuentes web para mejorar la legibilidad y la velocidad de carga.",
    "SEO": "Metaetiquetas: comprueba si las metaetiquetas importantes están presentes en su sitio web, como la etiqueta de título, la etiqueta de descripción y la etiqueta viewport.\nEstructura del contenido: comprueba si el contenido de su sitio web está técnicamente optimizado para los motores de búsqueda.\nEnlaces: comprueba si los enlaces de su sitio web son funcionales y están optimizados para los motores de búsqueda."
  };

  // Promedios de cada métrica
  const promedios = [
    { name: "Rendimiento", score: calcularPromedio("Rendimiento", datos.reports) },
    { name: "Accesibilidad", score: calcularPromedio("Accesibilidad", datos.reports) },
    { name: "Buenas Prácticas", score: calcularPromedio("Buenas Prácticas", datos.reports) },
    { name: "SEO", score: calcularPromedio("SEO", datos.reports) }
  ];

  // Estado para controlar la expansión de la sección de Auditoría
  const [auditoriaAbierta, setAuditoriaAbierta] = useState(false);
  const toggleAuditoria = () => setAuditoriaAbierta(prev => !prev);

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold mb-6">Resumen de los subdominios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {promedios.map((m, i) => (
          <TarjetaEstadistica
            key={i}
            nombre={m.name}
            score={m.score}
            descripcion={parametros[m.name]}
          />
        ))}
      </div>

     
      {datos.auditsScoreCero && datos.auditsScoreCero.length > 0 && (
        <div className="p-4 rounded-2xl shadow bg-white space-y-2 my-6">
          <div
            onClick={toggleAuditoria}
            className="flex items-center gap-2 cursor-pointer"
          >
            <motion.span
              className="inline-block select-none text-lg"
              animate={{ rotate: auditoriaAbierta ? 90 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                transformOrigin: "center",
                display: "inline-block",
                marginRight: "2px"
              }}
            >
              <FaChevronRight />
            </motion.span>
            <span className="text-lg font-bold">Auditoría</span>
          </div>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: auditoriaAbierta ? "auto" : 0, opacity: auditoriaAbierta ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="overflow-hidden"
            style={{ pointerEvents: auditoriaAbierta ? "auto" : "none" }}
          >
            <div className="flex flex-col gap-2 mt-4">
              {datos.auditsScoreCero.map((audit, idx) => (
                <div key={idx} className="flex items-center">
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      display: "inline-block",
                      marginRight: "0.5rem"
                    }}
                  ></span>
                  <span className="text-lg">{audit.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <div style={{ paddingTop: "1rem" }}></div>
      <div className="report-grid">
        <h3 className="report-subtitle">Gráfico de los promedios</h3>
        <Grafica datos={promedios} />
      </div>
    </div>
  );
}

export default PromediosResultadosDominio;
