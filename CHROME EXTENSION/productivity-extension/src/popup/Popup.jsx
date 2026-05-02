import GoalInput from "../components/GoalInput";
import SiteList from "../components/SiteList";
import StatsCard from "../components/StatsCard";

export default function Popup() {
  return (
    //<div className="w-90 mx-auto bg-linear-to-br from-slate-900 to-slate-800 text-white p-4">
     <div className="w-[320px] max-h-[520px] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <h1 className="text-lg font-bold text-center mb-4">
        ⚡FocusTrack
      </h1>

      <div className="space-y-4">
        <GoalInput />
        <SiteList />
        <StatsCard />
      </div>

    </div>
  );
}