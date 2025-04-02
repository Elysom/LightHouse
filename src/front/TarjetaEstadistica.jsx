import {getColor} from "../utiles/obtenerColor.jsx";
import {usarFlechitas} from "../utiles/usarFlechitas.jsx";

function TarjetaEstadistica({ nombre, score, descripcion }) {
  const {abierto, toggleDescripcion} = usarFlechitas();
  const puntos = descripcion.split("\n");

  return (
    <div className="p-4 rounded-2xl shadow bg-white space-y-2 text-left">
      <div className="flex items-center gap-2">
        <span
          className="cursor-pointer select-none text-lg"
          onClick={toggleDescripcion}
        >
          {abierto ? "v" : ">"}
        </span>
        <span
          className="text-lg font-semibold"
          style={{ color: typeof score === "number" ? getColor(score) : "#999" }}>
           {nombre} </span>
        <span className="text-lg font-mono font-bold text-black">
          {typeof score === "number" ? `${(score * 100).toFixed(0)}%` : "N/A"}
        </span>
      </div>

      {abierto && (
        <div className="text-sm text-gray-600 space-y-1 pl-1 pr-2">
          {puntos.map((punto, index) => {
            const [titulo, ...resto] = punto.split(":");
            const contenido = resto.join(":").trim();
            return (
              <p key={index} className="text-left">
                <strong>{titulo}:</strong> {contenido}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TarjetaEstadistica;