import "./StatsBar.css";
import { formatTime } from "../../utils/youtube";

function StatsBar({ pieces }) {
  const totalTime = pieces.reduce((sum, p) => sum + (p.practiceTime || 0), 0);
  // Gemeistert = "memorized"
  const mastered = pieces.filter((p) => p.progress === "memorized").length;
  const weekTime = pieces.reduce(
    (sum, p) => sum + Math.min(p.practiceTime || 0, 3600),
    0
  );

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Stücke</span>
        <span className="stat-value">{pieces.length}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Gesamtzeit</span>
        <span className="stat-value">{formatTime(totalTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Diese Woche</span>
        <span className="stat-value">{formatTime(weekTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Gemeistert</span>
        <span className="stat-value">{mastered}</span>
      </div>
    </div>
  );
}

export default StatsBar;
