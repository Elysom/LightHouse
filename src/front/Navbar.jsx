import React from 'react';

const Navbar = ({ isAnalizado, vista, setVista, handleRedirect }) => {
  // Estilo base de los botones
  const baseButtonClass =
    "px-4 py-2 rounded font-semibold shadow transition-colors duration-200";

  return (
    <nav 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: '#1F2937', // bg-gray-800
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        zIndex: 50,
      }}
    >
      {/* Logo y texto en la parte izquierda */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logo.jpeg"
          alt="Logo Sagatech"
          style={{ 
            borderRadius: '5px', 
            height: '70px',
          }}
        />
        <span 
          style={{ 
            color: '#FFFFFF', 
            fontWeight: 'bold', 
            marginLeft: '0.5rem',
            fontSize: '2rem',
          }}
        >
          Sagatech
        </span>
      </div>

      {/* Mostrar los botones solo si se ha analizado */}
      {isAnalizado && (
        <div 
          style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            display: 'flex', 
            gap: '1rem' 
          }}
        >
          <button
            onClick={() => setVista("dominios")}
            className={`${baseButtonClass} ${
              vista === "dominios"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            Resultados individuales
          </button>

          <button
            onClick={() => setVista("promedios")}
            className={`${baseButtonClass} ${
              vista === "promedios"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            Resultados (Promedios)
          </button>

          <button
            onClick={handleRedirect} // Llamamos a handleRedirect aquí para redirigir
            className={`${baseButtonClass} bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200`}
          >
            Ver en Unlighthouse
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
