import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./App.css";

function App() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Efecto para aplicar el modo oscuro al body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) throw new Error("Error en el análisis");

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Botón de modo oscuro en la esquina superior derecha */}
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
      </button>

      {/* Logo de la empresa */}
      <img src="/logo.jpeg" alt="SagaTech Logo" className="logo" />
      
      <h1 className="title">SagaTech Analizer</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Ingrese el dominio (ej. https://ejemplo.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Analizando..." : "Analizar"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {data && data.reports && (
        <div className="results-container">
          <h2 className="results-title">Resultados para {data.domain}</h2>
          <div className="reports-grid">
            {data.reports.map((report, index) => {
              const formattedMetrics = report.metrics.map(m => ({
                ...m,
                name: m.name.toLowerCase() === "accessibility" ? "Accesibilidad" : m.name
              }));
              return (
                <div key={index} className="report-card">
                  <h3 className="report-subtitle">Subdominio: {report.folder}</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart 
                      data={formattedMetrics} 
                      margin={{ bottom: 80 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#555" 
                        angle={0} 
                        textAnchor="middle"
                        tick={{ fontSize: 14 }}
                        tickMargin={10}
                      />
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
      )}
    </div>
  );
}

export default App;
