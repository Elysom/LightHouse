import React, { useState } from 'react';
import "./CodeModal.css"; 
const CodeModal = ({ isOpen, onClose }) => {


  const parametros = {
    "Rendimiento": "First Contentful Paint (FCP): el tiempo que tarda en aparecer el primer contenido en pantalla.\nSpeed Index (SI): el tiempo que tarda el contenido visible en aparecer en pantalla.\nTime to Interactive (TTI): el tiempo necesario para que el sitio web sea interactivo y responda a las acciones del usuario.",
    "Accesibilidad": "Contraste: comprueba si los colores de su sitio web tienen suficiente contraste para ser legibles por todos los usuarios.\nNavegación: comprueba si su sitio web es fácil de navegar utilizando un teclado y un lector de pantalla.\nContenido: comprueba si el contenido de su sitio web es accesible para todos los usuarios, incluidos aquellos con necesidades específicas de accesibilidad.",
    "Buenas Prácticas": "Uso de HTTPS: comprueba si su sitio web utiliza HTTPS para proteger los datos de los usuarios.\nOptimización de imágenes: comprueba si las imágenes de su sitio web están optimizadas para reducir el tiempo de carga.\nUso de fuentes web: comprueba si su sitio web utiliza fuentes web para mejorar la legibilidad y la velocidad de carga.",
    "SEO": "Metaetiquetas: comprueba si las metaetiquetas importantes están presentes en su sitio web, como la etiqueta de título, la etiqueta de descripción y la etiqueta viewport.\nEstructura del contenido: comprueba si el contenido de su sitio web está técnicamente optimizado para los motores de búsqueda.\nEnlaces: comprueba si los enlaces de su sitio web son funcionales y están optimizados para los motores de búsqueda."
  };
  const [selectedParametro, setSelectedParametro] = useState('');

  const handleChange = (event) => {
    setSelectedParametro(event.target.value);
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          {/* Botón para cerrar */}
          <button className="close-button" onClick={onClose}>X</button>
          <h2 className="modal-title">Glosario</h2>
          <select 
            value={selectedParametro}
            onChange={handleChange}
            className="dropdown"
          >
            <option value="">-- Selecciona un parámetro --</option>
            {Object.keys(parametros).map((key, index) => (
              <option key={index} value={key}>
                {key}
              </option>
            ))}
          </select>

          {selectedParametro && (
            <div className="param-description">
              <h3>Descripción:</h3>
              <p>{parametros[selectedParametro]}</p>
            </div>
          )}
        </div>
        
      </div>
    )
  );
};

export default CodeModal;
