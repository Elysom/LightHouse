import { useEffect } from "react";

function usarModoOscuro(modoOscuro) {
    useEffect(() => {
      document.body.classList.toggle("dark-mode", modoOscuro);
      localStorage.setItem("darkMode", modoOscuro);
    }, [modoOscuro]);
}
export default usarModoOscuro;