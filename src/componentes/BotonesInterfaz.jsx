import { useState } from "react";
import ResultadosDominio from "./ResultadosDominio";
import PromediosResultadosDominio from "./PromediosResultadosDominio";

function BotonesInterfaz({ datos }) {
  const [vista, setVista] = useState("dominios");

  // Función para redirigir al endpoint dinámico que encuentra unlighthouse.html
  const handleRedirect = () => {
    window.open("http://localhost:5000/ver-unlighthouse", "_blank");
  };

  const baseButtonClass =
    "px-4 py-2 rounded font-semibold shadow transition-colors duration-200";

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
