import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Componente para manejar la gráfica con colores dinámicos
function GraficoBarra({ datos }) {
  const getColor = (value) => {
    if (value < 0.50) return "#e63946"; // Rojo
    if (value < 0.80) return "#ffb703"; // Amarillo
    return "#2a9d8f";                   // Verde
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={datos} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
        <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 12 }} tickMargin={10} interval={0} />
        <YAxis stroke="#555" />
        <Tooltip />
        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
          {datos.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Componente principal de resultados
function ResultadosDominio({ datos }) {
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
              <h3 className="report-subtitle">Subdominio: {report.folder}</h3>
              <GraficoBarra datos={formattedMetrics} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultadosDominio;
