import {useEffect} from "react";

function BcModoOscuro(modoOscuro) {
    useEffect(() => {
      document.body.classList.toggle("dark-mode", modoOscuro);
      localStorage.setItem("darkMode", modoOscuro);
    }, [modoOscuro]);
}

export default BcModoOscuro;