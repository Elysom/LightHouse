import { useEffect } from "react";

function ModoOscuro({ modoOscuro, setModoOscuro }) {
  //Lógica modo oscuro
  useEffect(() => {
    document.body.classList.toggle("dark-mode", modoOscuro);
    localStorage.setItem("darkMode", modoOscuro);
  }, [modoOscuro]);

  //Interfaz botón
  return (
    <button className="dark-mode-toggle" onClick={() => setModoOscuro(!modoOscuro)}>
      {modoOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
    </button>
  );
}

export default ModoOscuro;