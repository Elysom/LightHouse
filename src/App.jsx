
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./App.css";

function App() {
  const [dominio, setDominio] = useState("");
  const [analizando, setAnalizando] = useState(false);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Función para aplicar el modo oscuro
  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", modoOscuro);
  }, [modoOscuro]);

  // Función para enviar la solicitud al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnalizando(true);
    setError(null);
    setDatos(null);

    try {
      const response = await fetch("http://localhost:5000/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: dominio }),
      });

      if (!response.ok) throw new Error("Error en el análisis");

      const resultados = await response.json();
      setDatos(resultados);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalizando(false);
    }
  };

  //Interfaz de la aplicación web
  return (
    <div className="app-container wide-container">
      {/* Botón de modo oscuro */}
      <button className="dark-mode-toggle" onClick={() => setModoOscuro(!modoOscuro)}>
        {modoOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
      </button>

      {/* Analizador de subdominios */}
      <img src="/logo.jpeg" alt="SagaTech Logo" className="logo" />
      
      <h1 className="title">Analizador Sagatech</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Ingrese el dominio (ej. https://ejemplo.com)"
          value={dominio}
          onChange={(e) => setDominio(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-btn" disabled={analizando}>
          {analizando ? "Analizando..." : "Analizar"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* Generar gráficas */}
      {datos && datos.reports && (
        <div className="results-container">
          <h2 className="results-title">Resultados para: {datos.domain}</h2>
          <div className="reports-grid">
            {datos.reports.map((report, index) => {
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
