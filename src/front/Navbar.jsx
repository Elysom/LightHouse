import React, { useEffect, useRef, useState } from 'react';

const Navbar = ({ isAnalizado, vista, setVista, handleRedirect }) => {
  const containerRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const navLinks = [
    {
      label: 'Resultados individuales',
      key: 'dominios',
      onClick: () => setVista('dominios'),
    },
    {
      label: 'Resultados (Promedios)',
      key: 'promedios',
      onClick: () => setVista('promedios'),
    },
    {
      label: 'Ver en Unlighthouse',
      key: 'redirect',
      onClick: handleRedirect,
    },
  ];

  useEffect(() => {
    if (containerRef.current) {
      // Buscamos el enlace activo según el data-key
      const activeLink = containerRef.current.querySelector(`[data-key="${vista}"]`);
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
      }
    }
  }, [vista, isAnalizado]);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',          // Altura del navbar
        backgroundColor: '#1F2937',
        zIndex: 50,
      }}
    >
      {/* Contenedor principal en posición relativa para ubicar logo y enlaces */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Logo y nombre a la izquierda */}
        <div
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
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

        {/* Enlaces centrados horizontalmente */}
        {isAnalizado && (
          <div
            ref={containerRef}
            style={{
              position: 'absolute',
              left: '82%',
              top: '50%',
              transform: 'translate(-50%, -50%)',  // Centro horizontal y vertical
              display: 'flex',
              gap: '2rem',
              // position: 'relative' para que el indicador se ancle a este contenedor
              position: 'relative',
            }}
          >
            {navLinks.map((link) => (
              <span
                key={link.key}
                data-key={link.key}
                onClick={link.onClick}
                style={{
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  paddingBottom: '5px', // Espacio para el subrayado
                  transition: 'color 0.3s',
                }}
              >
                {link.label}
              </span>
            ))}
            {/* Indicador subrayado animado */}
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                left: underlineStyle.left,
                width: underlineStyle.width,
                height: '2px',
                background: 'white',
                transition: 'left 0.3s, width 0.3s',
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
