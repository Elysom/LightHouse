import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={formattedMetrics} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                  <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 12 }} tickMargin={10} interval={0} />
                  <YAxis stroke="#555" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultadosDominio;
