export function calcularPromedio(nombreMetrica, reports) {
    const valores = reports
      .map((report) => {
        const metrica = report.metrics.find((m) => m.name === nombreMetrica);
        return metrica && typeof metrica.score === "number" ? metrica.score : null;
      })
      .filter((score) => score !== null);
  
    if (valores.length === 0) return "N/A";
  
    const promedio = valores.reduce((acc, val) => acc + val, 0) / valores.length;
    return parseFloat(promedio.toFixed(2));
  }