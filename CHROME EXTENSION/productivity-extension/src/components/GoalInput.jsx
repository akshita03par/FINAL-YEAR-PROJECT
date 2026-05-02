import { useState, useEffect } from "react";

export default function GoalInput() {
  const [goal, setGoal] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(["goal"], (res) => {
      if (res.goal) {
        setGoal(res.goal.text);
        setProgress(res.goal.progress);
      }
    });
  }, []);

  const saveGoal = () => {
    if (!goal.trim()) return;
    chrome.storage.local.set({
      goal: { text: goal, progress: 0 }
    });
    setProgress(0);
  };

  const addProgress = () => {
    if (progress >= 100) {
      alert("🎉 Goal Completed! Set new goal");
      setGoal("");
      setProgress(0);
      chrome.storage.local.set({
        goal: { text: "", progress: 0 }
      });
      return;
    }

    let newProgress = Math.min(progress + 10, 100);
    setProgress(newProgress);

    chrome.storage.local.set({
      goal: { text: goal, progress: newProgress }
    });
  };

  return (
    <div className="w-full bg-slate-800 p-4 rounded-2xl shadow border border-slate-700">
      <h2 className="text-sm text-gray-300 mb-2">🎯 Daily Goal</h2>

      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter goal..."
        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-sm mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <div className="flex gap-2">
        <button
          onClick={saveGoal}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm"
        >
          Save
        </button>

        <button
          onClick={addProgress}
          disabled={progress === 100}
          className={`flex-1 py-2 rounded text-sm ${
            progress === 100
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          +10%
        </button>
      </div>

      <div className="mt-3">
        <div className="w-full bg-slate-700 h-2 rounded">
          <div
            className="bg-green-400 h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-xs mt-1 text-gray-400">
          {progress === 100 ? "🎉 Completed!" : `${progress}% completed`}
        </p>
      </div>
    </div>
  );
}