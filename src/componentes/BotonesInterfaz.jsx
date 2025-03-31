import { useState } from "react";
import ResultadosDominio from "./ResultadosDominio";
import PromediosResultadosDominio from "./PromediosResultadosDominio";

function BotonesInterfaz({ datos }) {
  const [vista, setVista] = useState("dominios");

  // Función para redirigir al archivo unlighthouse.html a través del endpoint del servidor
  const handleRedirect = async () => {
    try {
      console.log("Solicitando archivo unlighthouse.html...");
      const response = await fetch("http://localhost:5000/api/encontrar-unlighthouse");
      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del endpoint:", data);
        if (data.url) {
          // Si data.url no comienza con una '/', se la agrega
          const relativeUrl = data.url.startsWith('/') ? data.url : `/${data.url}`;
          // Concatenamos la URL base del servidor con la ruta relativa devuelta por el endpoint
          const fullUrl = `http://localhost:5000${relativeUrl}`;
          console.log("Abriendo URL:", fullUrl);
          window.open(fullUrl, "_blank");
        } else {
          console.error("La respuesta no contiene la propiedad 'url'.");
        }
      } else {
        console.error("Error en la respuesta del servidor:", response.status);
      }
    } catch (error) {
      console.error("Error al buscar el archivo:", error);
    }
  };

  // Estilo de los botones
  const baseButtonClass =
    "px-4 py-2 rounded font-semibold shadow transition-colors duration-200";

   // Interfaz con los botones
   return (
    <div className="space-y-6">
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setVista("dominios")}
          style={{ margin: "3px" }}
          className={`${baseButtonClass} ${
            vista === "dominios"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 border border-blue-300"
          }`}
        >
          Resultados individuales
        </button>

        <button
          onClick={() => setVista("promedios")}
          style={{ margin: "3px" }}
          className={`${baseButtonClass} ${
            vista === "promedios"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 border border-blue-300"
          }`}
        >
          Resultados (Promedios)
        </button>

        <button
          onClick={handleRedirect}
          style={{ margin: "3px" }}
          className={`${baseButtonClass} bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200`}
        >
          Ver en Unlighthouse
        </button>
      </div>

      {vista === "dominios" ? (
        <ResultadosDominio datos={datos} />
      ) : (
        <PromediosResultadosDominio datos={datos} />
      )}
    </div>
  );
 }

export default BotonesInterfaz;
