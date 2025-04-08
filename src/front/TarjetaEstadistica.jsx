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
            type: "spring",    
            stiffness: 100,    
            damping: 20,       
            duration: 0.5,     
          }}
          style={{
            transformOrigin: "center", 
            display: "inline-block",
            marginRight: "2px", 
          }}
        >
          <FaChevronRight />
        </motion.span>
        <span
          className="text-lg font-bold"
          style={{ color: typeof score === "number" ? getColor(score) : "#999" }}
        >
          {nombre+' '}
        </span>
        <span className="text-lg font-mono font-bold text-black">
          {typeof score === "number" ? `${(score * 100).toFixed(0)}` : "N/A"}
          %
        </span>
      </div>

      {/* Contenido desplegable */}
      <motion.div
        initial={{ height: 0, opacity: 0 }} 
        animate={{
          height: abierto ? "auto" : 0,  
          opacity: abierto ? 1 : 0,      
        }} 
        exit={{ height: 0, opacity: 0 }} 
        transition={{
          type: "spring",       
          stiffness: 80,        
          damping: 25,          
          duration: 0.6,        
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
          initial={{ opacity: 0 }}  
          animate={{ opacity: 1 }}   
          transition={{
            duration: 0.7,   
            ease: "easeInOut", 
            delay: 0.3,      
          }} 
          className="pt-3"
        >
          <h4 className="font-semibold text-red-600 mb-2">Auditorías fallidas</h4>
          <div className="space-y-1">
            {auditorias.map((audit, idx) => (
              <div key={idx} className="flex items-center">
                {/* Círculo rojo al lado de cada auditoría  de momemnto no funciona*/} 
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
