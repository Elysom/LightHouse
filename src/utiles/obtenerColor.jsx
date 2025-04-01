export function getColor(score) {
    if (score < 0.50) return "#e63946"; // Rojo
    if (score < 0.80) return "#ffb703"; // Amarillo
    return "#2adb16";                   // Verde
  }