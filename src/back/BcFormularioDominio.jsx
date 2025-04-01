import { useState, useEffect } from "react";
import FormularioDominio from "../componentes/FormularioDominio";

function BcFormularioDominio({ setDatos, setError, setAnalizando, analizando }) {
  const [dominio, setDominio] = useState("");
  const [textoAnimado, setTextoAnimado] = useState("Analizando.");

  // Validación para el dominio ingresado por el usuario
  const validarDominio = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Enviar petición al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarDominio(dominio)) {
      setError("**Por favor, ingresa un https válido (ej. https://ejemplo.com)**");
      return;
    }
    setAnalizando(true);
    setError(null);
    setDatos(null);

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
      setAnalizando(false);
    }
  };

  // Animación del botón Analizando
  useEffect(() => {
    if (!analizando) {
      setTextoAnimado("Analizando.");
      return;
    }

    const frames = ["Analizando.", "Analizando..", "Analizando..."];
    let i = 0;
    const intervalo = setInterval(() => {
      setTextoAnimado(frames[i % frames.length]);
      i++;
    }, 500);

    return () => clearInterval(intervalo);
  }, [analizando]);

  // Renderizado de la interfaz FormularioDominio
  return (
    <FormularioDominio
      setDominio={setDominio}
      dominio={dominio}
      handleSubmit={handleSubmit}
      analizando={analizando}
      textoAnimado={textoAnimado}
    />
  );
}

export default BcFormularioDominio;