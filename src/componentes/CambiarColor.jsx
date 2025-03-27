function getColor({score}) {
    if (score < 0.5) return "#e63946";
    if (score < 0.8) return "#ffb703";
    return "#2a9d8f";
  }

  export default getColor;