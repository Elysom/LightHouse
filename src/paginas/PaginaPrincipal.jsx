import { useState } from "react";
import BcModoOscuro from "../back/BcModoOscuro";
import BotonModoOscuro from "../front/BotonModoOscuro";
import BcFormularioDominio from "../back/BcFormularioDominio";
import BcNavbar from "../back/BcNavbar";
import Navbar from "../front/Navbar";
import "./PaginaPrincipal.css";

function PaginaPrincipal() {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  BcModoOscuro(modoOscuro);

  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [analizando, setAnalizando] = useState(false);

  return (
    <>
      {/* Navbar totalmente arriba */}
      <Navbar/>

      {/* Botón modo oscuro */}
      <BotonModoOscuro modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />

      {/* Contenedor principal */}
      <div className={`app-container wide-container ${modoOscuro ? "modo-oscuro" : ""}`}>

        {/* Título */}
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

        {/* Mostrar los resultados si hay datos */}
        {datos && datos.reports && <BcNavbar datos={datos} />}
      </div>
    </>
  );
}

export default PaginaPrincipal;