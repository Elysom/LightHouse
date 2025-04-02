import { useState } from "react";

export function usarFlechitas() {
  const [abierto, setAbierto] = useState(false);

  const toggle = (e) => {
    e.stopPropagation();
    setAbierto((prev) => !prev);
  };

  return {
    abierto,
    toggleDescripcion: toggle,
  };
}