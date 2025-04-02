import React from 'react';
import { useState } from 'react';

const Header = () => {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  usarModoOscuro(modoOscuro);
  return (
    <header className={`w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md ${modoOscuro ? "modo-oscuro" : ""}`}>
      <div className="text-lg font-semibold">
        <span>Mi Logo</span>
      </div>
      <nav className="space-x-4">
        <a href="#home" className="hover:text-gray-400">Inicio</a>
        <a href="#services" className="hover:text-gray-400">Servicios</a>
        <a href="#contact" className="hover:text-gray-400">Contacto</a>
        
      </nav>
    </header>
  );
};

export default Header;