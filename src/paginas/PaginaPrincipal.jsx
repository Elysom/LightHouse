import { useState } from "react";
import ModoOscuro from "../componentes/ModoOscuro";
import FormularioDominio from "../componentes/FormularioDominio";
import BotonesInterfaz from "../componentes/BotonesInterfaz";
import "./PaginaPrincipal.css";

function PaginaPrincipal() {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [analizando, setAnalizando] = useState(false);

  return (
    <div className="app-container wide-container">
      <ModoOscuro modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      <img src="/logo.jpeg" alt="SagaTech Logo" className="logo" />
      <h1 className="title">Analizador Sagatech</h1>
      <FormularioDominio setDatos={setDatos} setError={setError} setAnalizando={setAnalizando} analizando={analizando} />
      {error && <p className="error-message">{error}</p>}
      {datos && datos.reports && <BotonesInterfaz datos={datos} />}
    </div>
  );
}

export default PaginaPrincipal;