import { getColor } from "../utiles/obtenerColor.jsx";

function TarjetaEstadistica({ nombre, score, descripcion }) {
  const puntos = descripcion.split("\n");

  return (
    <div className="p-4 rounded-2xl shadow bg-white space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold" style={{ color: typeof score === "number" ? getColor(score) : '#999' }}>
          {nombre}
        </h4>
        <span className="text-lg font-mono font-bold">
          {typeof score === "number" ? `${(score * 100).toFixed(0)}%` : "N/A"}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1 pl-1 pr-2">
        {puntos.map((punto, index) => {
          const [titulo, ...resto] = punto.split(":");
          const contenido = resto.join(":").trim();
          return (
            <p key={index} className="text-justify">
              <strong>{titulo}:</strong> {contenido}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default TarjetaEstadistica;