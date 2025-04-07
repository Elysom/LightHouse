export function getColor(score) {
    if (score < 0.50) return "#e63946"; // Rojo
    if (score < 0.80) return "#ffb703"; // Amarillo
    return "#1e8e0e";                   // Verde
  }