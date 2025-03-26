import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const obtenerPromedioPorNombre = (nombreMetrica, reports) => {
  const valores = reports
    .map((report) => {
      const metrica = report.metrics.find((m) => m.name === nombreMetrica);
      return metrica && typeof metrica.score === "number" ? metrica.score : null;
    })
    .filter((score) => score !== null);

  if (valores.length === 0) return "N/A";

  const promedio = valores.reduce((acc, val) => acc + val, 0) / valores.length;
  return parseFloat(promedio.toFixed(2));
};

function getColor(score) {
  if (score < 0.5) return "#e63946";
  if (score < 0.8) return "#ffb703";
  return "#2a9d8f";
}

function TarjetaEstadistica({ nombre, score, descripcion }) {
  return (
    <div className="p-4 rounded-2xl shadow bg-white space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold" style={{ color: typeof score === "number" ? getColor(score) : '#999' }}>{nombre}</h4>
        <span className="text-lg font-mono font-bold">
          {typeof score === "number" ? `${(score * 100).toFixed(0)}%` : "N/A"}
        </span>
      </div>
      <p className="text-sm text-gray-600 whitespace-pre-line">{descripcion}</p>
    </div>
  );
}

function GraficoResumen({ datos }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={datos} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
        <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 12 }} tickMargin={10} interval={0} />
        <YAxis stroke="#555" />
        <Tooltip />
        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
          {datos.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function PromediosResultadosDominio({ datos }) {
  const descripciones = {
    "Rendimiento": "First Contentful Paint (FCP): el tiempo que tarda en aparecer el primer contenido en pantalla.\nSpeed Index (SI): el tiempo que tarda el contenido visible en aparecer en pantalla.\nTime to Interactive (TTI): el tiempo necesario para que el sitio web sea interactivo y responda a las acciones del usuario.",
    "Accesibilidad": "Contraste: comprueba si los colores de su sitio web tienen suficiente contraste para ser legibles por todos los usuarios.\nNavegación: comprueba si su sitio web es fácil de navegar utilizando un teclado y un lector de pantalla.\nContenido: comprueba si el contenido de su sitio web es accesible para todos los usuarios, incluidos aquellos con necesidades específicas de accesibilidad.",
    "Buenas Prácticas": "Uso de HTTPS: comprueba si su sitio web utiliza HTTPS para proteger los datos de los usuarios.\nOptimización de imágenes: comprueba si las imágenes de su sitio web están optimizadas para reducir el tiempo de carga.\nUso de fuentes web: comprueba si su sitio web utiliza fuentes web para mejorar la legibilidad y la velocidad de carga.",
    "SEO": "Metaetiquetas: comprueba si las metaetiquetas importantes están presentes en su sitio web, como la etiqueta de título, la etiqueta de descripción y la etiqueta viewport.\nEstructura del contenido: comprueba si el contenido de su sitio web está técnicamente optimizado para los motores de búsqueda.\nEnlaces: comprueba si los enlaces de su sitio web son funcionales y están optimizados para los motores de búsqueda."
  };

  const promedios = [
    { name: "Rendimiento", score: obtenerPromedioPorNombre("Rendimiento", datos.reports) },
    { name: "Accesibilidad", score: obtenerPromedioPorNombre("Accesibilidad", datos.reports) },
    { name: "Buenas Prácticas", score: obtenerPromedioPorNombre("Buenas Prácticas", datos.reports) },
    { name: "SEO", score: obtenerPromedioPorNombre("SEO", datos.reports) }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resumen de los subdominios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {promedios.map((m, i) => (
          <TarjetaEstadistica key={i} nombre={m.name} score={m.score} descripcion={descripciones[m.name]} />
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Gráfico de los promedios</h3>
        <GraficoResumen datos={promedios} />
      </div>
    </div>
  );
}

export default PromediosResultadosDominio;