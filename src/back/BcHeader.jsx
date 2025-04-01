import { useState } from "react";
import Header from "../componentes/Header";

function BcHeader({ datos }) {
  // Estado para controlar qué vista mostrar
  const [vista, setVista] = useState("dominios");

  // Función para redirigir al archivo unlighthouse.html a través del endpoint del servidor
  const handleRedirect = async () => {
    try {
      console.log("Solicitando archivo unlighthouse.html...");
      const response = await fetch("http://localhost:5000/api/encontrar-unlighthouse");
      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del endpoint:", data);
        if (data.url) {
          // Si data.url no comienza con una '/', se la agrega
          const relativeUrl = data.url.startsWith('/') ? data.url : `/${data.url}`;
          // Concatenamos la URL base del servidor con la ruta relativa devuelta por el endpoint
          const fullUrl = `http://localhost:5000${relativeUrl}`;
          console.log("Abriendo URL:", fullUrl);
          window.open(fullUrl, "_blank");
        } else {
          console.error("La respuesta no contiene la propiedad 'url'.");
        }
      } else {
        console.error("Error en la respuesta del servidor:", response.status);
      }
    } catch (error) {
      console.error("Error al buscar el archivo:", error);
    }
  };

  // Renderizado de la interfaz Header con la vista seleccionada
  return (
    <Header
      datos={datos}
      vista={vista}
      setVista={setVista}
      handleRedirect={handleRedirect}
    />
  );
}

export default BcHeader;