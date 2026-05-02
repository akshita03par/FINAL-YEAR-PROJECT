function getLast7Days(days) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const sites = Object.values(days[key]?.sites || {});
    const total = sites.reduce((sum, site) => sum + (site.seconds || 0), 0);
    const productive = sites
      .filter((site) => site.category === "productive")
      .reduce((sum, site) => sum + (site.seconds || 0), 0);

    return {
      key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      minutes: Math.round(total / 60),
      productiveMinutes: Math.round(productive / 60)
    };
  });
}

export default function TrendChart({ days }) {
  const trend = getLast7Days(days);
  const max = Math.max(...trend.map((day) => day.minutes), 1);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Productivity Trends</p>
        <h2 className="text-lg font-black text-slate-950">Last 7 days</h2>
      </div>

      <div className="grid h-36 grid-cols-7 items-end gap-2">
        {trend.map((day) => {
          const totalHeight = Math.max(8, (day.minutes / max) * 100);
          const productiveHeight = day.minutes ? Math.max(0, (day.productiveMinutes / day.minutes) * 100) : 0;

          return (
            <div key={day.key} className="flex h-full flex-col items-center justify-end gap-2">
              <div className="relative w-full overflow-hidden rounded-t-lg bg-slate-200" style={{ height: `${totalHeight}%` }}>
                <div className="absolute bottom-0 left-0 w-full bg-teal-500" style={{ height: `${productiveHeight}%` }} />
              </div>
              <span className="text-[11px] font-bold text-slate-500">{day.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs font-bold text-slate-500">
        <span className="inline-flex items-center gap-1">
          <i className="h-2 w-2 rounded-full bg-teal-500" />
          Productive
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="h-2 w-2 rounded-full bg-slate-300" />
          Total
        </span>
      </div>
    </section>
  );
}