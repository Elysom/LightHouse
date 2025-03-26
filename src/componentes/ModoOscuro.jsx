import { useEffect } from "react";

function ModoOscuro({ modoOscuro, setModoOscuro }) {
  useEffect(() => {
    document.body.classList.toggle("dark-mode", modoOscuro);
    localStorage.setItem("darkMode", modoOscuro);
  }, [modoOscuro]);

  return (
    <label className="switch">
      <input type="checkbox" checked={modoOscuro} onChange={() => setModoOscuro(!modoOscuro)} />
      <span className="slider"></span>
    </label>
  );
}

export default ModoOscuro;