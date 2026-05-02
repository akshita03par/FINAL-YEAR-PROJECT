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

export default function StatsCard() {
  return (
    <div className="w-full bg-slate-800 p-4 rounded-2xl shadow border border-slate-700">
      <h2 className="text-sm text-gray-300 mb-2">📊 Trend</h2>

      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="time" stroke="#4ade80" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}