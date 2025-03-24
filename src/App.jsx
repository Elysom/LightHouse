
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
      const response = await fetch("http://localhost:5000/analizar", {
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
    // Se le asigna la clase 'wide-container' para que tenga un ancho mayor y se evite el scroll
    <div className="app-container wide-container">
      {/* Botón de modo oscuro */}
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
      </button>

      {/* Logo */}
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
              const formattedMetrics = report.metrics.map((m) => {
                const lowerName = m.name.toLowerCase();
                if (lowerName === "accessibility" || lowerName === "accesibilidad") {
                  return { ...m, name: "Accesibilidad" };
                }
                return m;
              });

              return (
                <div key={index} className="report-card">
                  <h3 className="report-subtitle">Subdominio: {report.folder}</h3>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart 
                      data={formattedMetrics} 
                      margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
                    >
                      <XAxis 
                        dataKey="name" 
                        stroke="#555" 
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                        interval={0}
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
