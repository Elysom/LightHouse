import { useState, useRef } from "react";
import Header from "../componentes/Header";
import LoadingPopup from "../componentes/LoadingPopup";

function BcHeader({ datos }) {
  const [vista, setVista] = useState("dominios");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  // Inicia la simulación del progreso
  const startProgress = () => {
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 5 : prev));
    }, 150);
  };

  // Finaliza la simulación del progreso
  const stopProgress = () => {
    clearInterval(intervalRef.current);
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
      setLoading(false);
    }, 800);
  };
  
  // Función para ejecutar el análisis (simulación) y mostrar la barra de carga
  const handleVerUnlighthouse = async () => {
    if (!datos || !datos.domain) {
      console.error("Debe analizar el dominio primero.");
      return;
    }
    try {
      setLoading(true);
      startProgress();
      console.log("Ejecutando análisis para Unlighthouse...");
      
      const responseAnalizar = await fetch("http://localhost:5000/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: datos.domain }),
      });
      
      if (!responseAnalizar.ok) throw new Error("Error en el análisis");
      stopProgress();
    } catch (error) {
      console.error("Error al ejecutar análisis para Unlighthouse:", error);
      clearInterval(intervalRef.current);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      {loading && <LoadingPopup progress={progress} />}
      <Header datos={datos} vista={vista} setVista={setVista} handleRedirect={handleVerUnlighthouse} />
    </>
  );
}

export default BcHeader;
