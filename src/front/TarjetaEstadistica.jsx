import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";
import { getColor } from "../utiles/obtenerColor.jsx";

function TarjetaEstadistica({ nombre, score, descripcion, auditorias = [] }) {
  // Estado para controlar la apertura y cierre del contenido
  const [abierto, setAbierto] = useState(false);

  // Función para alternar el estado de 'abierto'
  const toggleDescripcion = () => setAbierto((prev) => !prev);

  const puntos = descripcion.split("\n");

  return (
    <div className="p-4 rounded-2xl shadow bg-white space-y-2 text-left">
      {/* Título y botón para abrir/cerrar */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDescripcion}>
        {/* Animación suave para la flecha */}
        <motion.span
          className="inline-block select-none text-lg"
          animate={{ rotate: abierto ? 90 : 0 }} // Rotación de la flecha
          transition={{
            type: "spring",    // Usamos un "spring" para mayor suavidad
            stiffness: 100,    // Controla la rigidez del movimiento (más alto = más rápido)
            damping: 20,       // Controla la amortiguación (más alto = más suave)
            duration: 0.5,     // Duración de la animación
          }}
          style={{
            transformOrigin: "center", // Asegura que la flecha rote sobre su centro
            display: "inline-block",
            marginRight: "2px", // Añadir un margen para separar el icono del texto
          }}
        >
          <FaChevronRight />
        </motion.span>
        <span
          className="text-lg font-bold"
          style={{ color: typeof score === "number" ? getColor(score) : "#999" }}
        >
          {nombre}
        </span>
        <span className="text-lg font-mono font-bold text-black">
          {typeof score === "number" ? `${(score * 100).toFixed(0)}` : "N/A"}{/* Aquí el número y el porcentaje no tienen espacio */}
          %
        </span>
      </div>

      {/* Contenido desplegable */}
      <motion.div
        initial={{ height: 0, opacity: 0 }} // Inicia con el contenido colapsado
        animate={{
          height: abierto ? "auto" : 0,  // Anima la expansión o colapso del contenido
          opacity: abierto ? 1 : 0,      // Suaviza la opacidad
        }} 
        exit={{ height: 0, opacity: 0 }} // Animación de salida
        transition={{
          type: "spring",       // Usamos un "spring" para que sea más suave
          stiffness: 80,        // Ajuste de rigidez
          damping: 25,          // Suaviza el movimiento
          duration: 0.6,        // Duración de la animación
        }} 
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

      {/* Auditorías fallidas (animación para la aparición) */}
      {auditorias.length > 0 && abierto && (
        <motion.div
          initial={{ opacity: 0 }}  // Inicia con la opacidad en 0 (oculto)
          animate={{ opacity: 1 }}   // Anima la opacidad a 1 (visible)
          transition={{
            duration: 0.7,   // Aumentamos la duración para que sea más suave
            ease: "easeInOut", // Suavizamos la transición
            delay: 0.3,      // Añadimos un pequeño retraso para que ocurra después de que se despliegue el contenido
          }} 
          className="pt-3"
        >
          <h4 className="font-semibold text-red-600 mb-2">Auditorías fallidas</h4>
          <div className="space-y-1">
            {auditorias.map((audit, idx) => (
              <div key={idx} className="flex items-center">
                {/* Círculo rojo al lado de cada auditoría */}
                <span
                  className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"
                ></span>
                <span className="text-lg">{audit.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default TarjetaEstadistica;
