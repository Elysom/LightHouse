import { useState, useEffect, useRef } from "react";
import LoadingPopup from "../front/LoadingPopup";
import FormularioDominio from "../front/FormularioDominio";

function BcFormularioDominio({ setDatos, setError, setAnalizando, analizando }) {
  const [dominio, setDominio] = useState("");
  const [textoAnimado, setTextoAnimado] = useState("Analizando");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  // Validación para el dominio ingresado por el usuario
  const validarDominio = (url) => {
    const regex = /^(https?:\/\/)/; // Verifica si la URL comienza con http:// o https://
    return regex.test(url);
  };

  // Inicia la simulación del progreso
  const startProgress = () => {
    setProgress(0);
    setTextoAnimado("Analizando"); // Mantén el texto de "Analizando" al principio
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + 5;
        } else {
          setTextoAnimado("Esperando respuesta de Unlighthouse"); // Cambia solo cuando llegue al 95%
          return prev;
        }
      });
    }, 1000);
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
    
    // Comprobamos si lo introducido es un dominio válido con https:// o http://
    if (!validarDominio(dominio)) {
      setError("**Por favor, ingresa un dominio válido con http:// o https:// (ej. https://ejemplo.com)**");
      return;
    }

    setAnalizando(true);
    setError(null);
    setDatos(null);
    startProgress();

    try {
      // Enviar la solicitud al servidor para verificar si el dominio existe
      const response = await fetch("http://localhost:5000/verificar-dominio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: dominio }),
      });

      const result = await response.json();
      if (!result.existe) {
        setError("**El dominio no existe o no es accesible.**");
        return;
      }

      // Si el dominio es válido y existe, enviar la solicitud para analizarlo
      const analisisResponse = await fetch("http://localhost:5000/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: dominio }),
      });

      if (!analisisResponse.ok) throw new Error("Error en el análisis");
      setDatos(await analisisResponse.json());
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
      {analizando && <LoadingPopup progress={progress} texto={textoAnimado} />}

      <FormularioDominio 
        setDominio={setDominio}
        dominio={dominio}
        handleSubmit={handleSubmit}
        analizando={analizando}
      />
    </>
  );
}

export default BcFormularioDominio;