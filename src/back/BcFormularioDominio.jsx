import { useState, useEffect, useRef } from "react";
import LoadingPopup from "../componentes/LoadingPopup";
import FormularioDominio from "../componentes/FormularioDominio";

function BcFormularioDominio({ setDatos, setError, setAnalizando, analizando }) {
  const [dominio, setDominio] = useState("");
  const [textoAnimado, setTextoAnimado] = useState("Analizando");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  
  

  // Validación para el dominio ingresado por el usuario
  const validarDominio = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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
    }, 800);
  };

  // Función para enviar el dominio al servidor y mostrar el popup de carga
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprobamos si lo introducido es un dominio válido
    if (!validarDominio(dominio)) {
      setError("**Por favor, ingresa un dominio válido (ej. https://ejemplo.com)**");
      return;
    }
    
    setAnalizando(true);
    setError(null);
    setDatos(null);
    startProgress();

    try {
      const response = await fetch("http://localhost:5000/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: dominio }),
      });
      if (!response.ok) throw new Error("Error en el análisis");
      setDatos(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      stopProgress();
      setAnalizando(false);
    }
  };
  

  // Renderizado de la interfaz FormularioDominio
  return (
    <>
      {/* Muestra el popup de carga mientras se está analizando */}
      {analizando && <LoadingPopup progress={progress} />}
  
      <FormularioDominio 
        setDominio={setDominio}
        dominio={dominio}
        handleSubmit={handleSubmit}
        analizando={analizando}
        textoAnimado={textoAnimado}
      />
    </>
  );
  
}

export default BcFormularioDominio;