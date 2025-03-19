import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./App.css";

function App() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Analizador de Dominios</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <input
          type="text"
          placeholder="Ingrese el dominio (ej. https://ejemplo.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Analizando..." : "Analizar"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {data && data.reports && (
        <div className="mt-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Resultados para {data.domain}</h2>
          {data.reports.map((report, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-teal-400 mb-4">Subdominio: {report.folder}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.metrics}>
                  <XAxis dataKey="name" stroke="#ddd" />
                  <YAxis stroke="#ddd" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
