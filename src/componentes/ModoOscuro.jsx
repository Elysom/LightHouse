import { useEffect } from "react";

function ModoOscuro({ modoOscuro, setModoOscuro }) {
  //Método para cambiar de modo
  useEffect(() => {
    document.body.classList.toggle("dark-mode", modoOscuro);
    localStorage.setItem("darkMode", modoOscuro);
  }, [modoOscuro]);

  //Interfaz botón modo oscuro
  return (
    <label className="switch">
      <input type="checkbox" checked={modoOscuro} onChange={() => setModoOscuro(!modoOscuro)} />
      <span className="slider"></span>
    </label>
  );
}

export default ModoOscuro;