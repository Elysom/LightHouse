import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getColor } from "../utiles/obtenerColor.jsx";

function Grafica({ datos, height = 400 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
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

export default Grafica;