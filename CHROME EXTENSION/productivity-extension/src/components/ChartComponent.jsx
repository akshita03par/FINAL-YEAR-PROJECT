import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Mon", time: 2 },
  { day: "Tue", time: 3 },
  { day: "Wed", time: 4 },
  { day: "Thu", time: 2 },
  { day: "Fri", time: 5 },
  { day: "Sat", time: 3 },
  { day: "Sun", time: 6 }
];

export default function ChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data}>
        <XAxis dataKey="day" stroke="#aaa" />
        <Tooltip />
        <Line dataKey="time" stroke="#4ade80" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}