import ResultadosDominio from "./ResultadosDominio";
import PromediosResultadosDominio from "./PromediosResultadosDominio";

function Botones({ datos, vista, setVista, handleRedirect }) {
  // Estilo base de los botones
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

      {/* Muestra la vista seleccionada según el botón */}
      {vista === "dominios" ? (
        <ResultadosDominio datos={datos} />
      ) : (
        <PromediosResultadosDominio datos={datos} />
      )}
    </div>
  );
}

export default Botones;