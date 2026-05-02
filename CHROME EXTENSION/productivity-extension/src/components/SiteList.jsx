import { useEffect, useState } from "react";

export default function SiteList() {
  const [data, setData] = useState({});

  useEffect(() => {
    chrome.storage.local.get(["timeData"], (res) => {
      setData(res.timeData || {});
    });
  }, []);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full bg-slate-800 p-4 rounded-2xl shadow border border-slate-700">
      <h2 className="text-sm text-gray-300">Total Time</h2>

      <p className="text-green-400 text-2xl mb-3">
        {total < 60 ? `${total}s` : `${(total / 60).toFixed(1)} min`}
      </p>

      <h3 className="text-xs text-gray-400 mb-2">Usage</h3>

      {entries.length === 0 && (
        <p className="text-gray-500 text-sm">No activity yet</p>
      )}

      {entries.map(([site, time]) => (
        <div key={site} className="flex justify-between text-sm mb-2">
          <span className="text-gray-200">{site}</span>
          <span className="text-green-400">
            {time < 60 ? `${time}s` : `${(time / 60).toFixed(1)} min`}
          </span>
        </div>
      ))}
    </div>
  );
}