import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./App.css";

function App() {
  const [dominio, setDomain] = useState("");
  const [cargando, setLoading] = useState(false);
  const [datos, setData] = useState(null);
  const [error, setError] = useState(null);
  const [modoOscuro, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Efecto para aplicar el modo oscuro
  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", modoOscuro);
  }, [modoOscuro]);

  // Función para enviar la solicitud de análisis
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("http://localhost:5000/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: dominio }),
      });

      if (!response.ok) throw new Error("Error en el análisis");

      const resultado = await response.json();
      setData(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Interfaz de la página web
  return (
    <div className="app-container">
      {/* Botón de modo oscuro en la esquina superior derecha */}
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!modoOscuro)}>
        {modoOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
      </button>

      {/* Logo de la empresa y título */}
      <img src="/logo.jpeg" alt="SagaTech Logo" className="logo" />
      <h1 className="title">Analizador de dominios</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
              {/* barra de busqueda */}
        <input
          type="text"
          placeholder="Ingrese el dominio (ej. https://ejemplo.com)"
          value={dominio}
          onChange={(e) => setDomain(e.target.value)}
          className="input-field"
        />
              {/* Botón analizar */}
        <button type="submit" className="submit-btn" disabled={cargando}>
          {cargando ? "Analizando..." : "Analizar"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {datos && datos.reports && (
        <div className="results-container">
          <h2 className="results-title">Resultados para: {datos.domain}</h2>
          {/* Generar gráficas */}
          <div className="reports-grid">
            {datos.reports.map((report, index) => {
              const formattedMetrics = report.metrics.map(m => ({
                ...m,
                name: m.name.toLowerCase() === "accessibility" ? "Accesibilidad" : m.name
              }));
              return (
                <div key={index} className="report-card">
                  <h3 className="report-subtitle">Subdominio: {report.folder}</h3>
                  {/* Estructura gráfica */}
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
