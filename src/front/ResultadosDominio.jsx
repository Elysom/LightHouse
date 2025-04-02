import { useState } from "react";
import Grafica from "./Grafica";
import MostrarDatos from "./MostrarDatos";

function ResultadosDominio({ datos }) {
  const [mostrarValores, setMostrarValores] = useState(false);

  return (
    <div className="results-container">
      <h2 className="results-title">Resultados para: {datos.domain}</h2>
      <div className="reports-grid">
        {datos.reports.map((report, index) => {
          const formattedMetrics = report.metrics.map((m) => ({
            ...m,
            name: m.name.toLowerCase() === "accessibility" || m.name.toLowerCase() === "accesibilidad" ? "Accesibilidad" : m.name,
          }));

          return (
            <div key={index} className="report-card">
              <MostrarDatos mostrarValores={mostrarValores} setMostrarValores={setMostrarValores} />
              <h3 className="report-subtitle">Subdominio: {report.folder}</h3>
              <Grafica datos={formattedMetrics} height={500} mostrarValores={mostrarValores} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultadosDominio;
