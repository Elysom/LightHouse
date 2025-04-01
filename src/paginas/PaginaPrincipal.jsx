import { useState } from "react";
import usarModoOscuro from "../utiles/usarModoOscuro";
import BotonModoOscuro from "../componentes/BotonModoOscuro";
import BcFormularioDominio from "../back/BcFormularioDominio";
import BcHeader from "../back/BcHeader";
import "./PaginaPrincipal.css";

function PaginaPrincipal() {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  usarModoOscuro(modoOscuro);

  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [analizando, setAnalizando] = useState(false);

  return (
    <div className={`app-container wide-container ${modoOscuro ? "modo-oscuro" : ""}`}>
      {/* Toggle modo oscuro */}
      <BotonModoOscuro modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />

      {/* Logo + título */}
      <img src="/logo.jpeg" alt="SagaTech Logo" className="logo" />
      <h1 className="title">Analizador Sagatech</h1>

      {/* Formulario para ingresar el dominio */}
      <BcFormularioDominio
        setDatos={setDatos}
        setError={setError}
        setAnalizando={setAnalizando}
        analizando={analizando}
      />

      {/* Mensaje de error si lo hay */}
      {error && <p className="error-message">{error}</p>}

      {/* Mostrar resultados si hay datos */}
      {datos && datos.reports && <BcHeader datos={datos} />}
    </div>
  );
}

export default PaginaPrincipal;