import "./StatsBar.css";
import { formatTime } from "../../utils/youtube";

function StatsBar({ pieces }) {
  const totalTime = pieces.reduce((sum, p) => sum + (p.practiceTime || 0), 0);
  // Gemeistert = "memorized" and "perfected"
  const mastered = pieces.filter(
    (p) => p.progress === "memorized" || p.progress === "perfected"
  ).length;
  const weekTime = pieces.reduce(
    (sum, p) => sum + Math.min(p.practiceTime || 0, 3600),
    0
  );

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Pieces</span>
        <span className="stat-value">{pieces.length}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Total time</span>
        <span className="stat-value">{formatTime(totalTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">This week</span>
        <span className="stat-value">{formatTime(weekTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Mastered</span>
        <span className="stat-value">{mastered}</span>
      </div>
    </div>
  );
}

export default StatsBar;
