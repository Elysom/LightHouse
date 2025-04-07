import React, {useState} from "react";
import {motion} from "framer-motion";
import {FaChevronRight} from "react-icons/fa";
import {getColor} from "../utiles/obtenerColor.jsx";

function TarjetaEstadistica({ nombre, score, descripcion }) {
  const [abierto, setAbierto] = useState(false);
  const toggleDescripcion = () => setAbierto((prev) => !prev);
  const puntos = descripcion.split("\n");

  return (
    <div className="p-4 rounded-2xl shadow bg-white space-y-2 text-left">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={toggleDescripcion}
      >
        <motion.span
          className="inline-block select-none text-lg"
          animate={{ rotate: abierto ? 90 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            transformOrigin: "center",
            display: "inline-block",
            marginRight: "2px",  // Añadir un margen para separar el icono del texto
          }}
        >
          <FaChevronRight />
        </motion.span>
        <span
          className="text-lg font-bold"
          style={{ color: typeof score === "number" ? getColor(score) : "#999" }}
        >
          {nombre} {/* Aquí dejamos un espacio entre el nombre y el número */}
        </span>
        <span className="text-lg font-mono font-bold text-black">
          {typeof score === "number" ? `${(score * 100).toFixed(0)}` : "N/A"}{/* Aquí el número y el porcentaje no tienen espacio */}
          %
        </span>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: abierto ? "auto" : 0, opacity: abierto ? 1 : 0 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
        style={{ pointerEvents: abierto ? "auto" : "none" }}
      >
        <div className="text-sm text-gray-600 space-y-1 pl-1 pr-2">
          {puntos.map((punto, index) => {
            const [titulo, ...resto] = punto.split(":");
            const contenido = resto.join(":").trim();
            return (
              <p key={index} className="text-left">
                <strong className="font-bold">{titulo}:</strong> {contenido}
              </p>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default TarjetaEstadistica;
