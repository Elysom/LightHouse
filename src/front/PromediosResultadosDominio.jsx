import {calcularPromedio} from "../utiles/calcularPromedio.jsx";
import Grafica from "./Grafica.jsx";
import TarjetaEstadistica from "./TarjetaEstadistica.jsx";

function PromediosResultadosDominio({ datos }) {
  // Parámetros de cada métrica
  const parametros = {
    "Rendimiento": "First Contentful Paint (FCP): el tiempo que tarda en aparecer el primer contenido en pantalla.\nSpeed Index (SI): el tiempo que tarda el contenido visible en aparecer en pantalla.\nTime to Interactive (TTI): el tiempo necesario para que el sitio web sea interactivo y responda a las acciones del usuario.",
    "Accesibilidad": "Contraste: comprueba si los colores de su sitio web tienen suficiente contraste para ser legibles por todos los usuarios.\nNavegación: comprueba si su sitio web es fácil de navegar utilizando un teclado y un lector de pantalla.\nContenido: comprueba si el contenido de su sitio web es accesible para todos los usuarios, incluidos aquellos con necesidades específicas de accesibilidad.",
    "Buenas Prácticas": "Uso de HTTPS: comprueba si su sitio web utiliza HTTPS para proteger los datos de los usuarios.\nOptimización de imágenes: comprueba si las imágenes de su sitio web están optimizadas para reducir el tiempo de carga.\nUso de fuentes web: comprueba si su sitio web utiliza fuentes web para mejorar la legibilidad y la velocidad de carga.",
    "SEO": "Metaetiquetas: comprueba si las metaetiquetas importantes están presentes en su sitio web, como la etiqueta de título, la etiqueta de descripción y la etiqueta viewport.\nEstructura del contenido: comprueba si el contenido de su sitio web está técnicamente optimizado para los motores de búsqueda.\nEnlaces: comprueba si los enlaces de su sitio web son funcionales y están optimizados para los motores de búsqueda."
  };

  // Promedios de cada métrica
  const promedios = [
    { name: "Rendimiento", score: calcularPromedio("Rendimiento", datos.reports) },
    { name: "Accesibilidad", score: calcularPromedio("Accesibilidad", datos.reports) },
    { name: "Buenas Prácticas", score: calcularPromedio("Buenas Prácticas", datos.reports) },
    { name: "SEO", score: calcularPromedio("SEO", datos.reports) }
  ];

  // Interfaz PromediosResultadosDominio
  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold mb-6">Resumen de los subdominios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {promedios.map((m, i) => (
          <TarjetaEstadistica
            key={i}
            nombre={m.name}
            score={m.score}
            descripcion={parametros[m.name]}
          />))}</div>
      <div style={{ paddingTop: "1rem" }}></div>
      <div className="report-grid">
        <h3 className="report-subtitle">Gráfico de los promedios</h3>
        <Grafica datos={promedios} />
      </div>
    </div>
  );
}

export default PromediosResultadosDominio;