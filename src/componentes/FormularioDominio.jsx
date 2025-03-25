import { useState, useEffect } from "react";

function FormularioDominio({ setDatos, setError, setAnalizando, analizando }) {
  const [dominio, setDominio] = useState("");
  const [textoAnimado, setTextoAnimado] = useState("Analizando.");


  // Función para enviar el dominio al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
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

   // Animación del botón de análisis
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

  //Interfaz del formulario
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        placeholder="Ingrese el dominio (ej. https://ejemplo.com)"
        value={dominio}
        onChange={(e) => setDominio(e.target.value)}
        className="input-field"
      />
      <button type="submit" className="submit-btn" disabled={analizando}>
        {analizando ? textoAnimado : "Analizar"}
      </button>
    </form>
  );
}

export default FormularioDominio;