import "./StatsBar.css";
import { formatTime } from "../../utils/youtube";

function StatsBar({ pieces }) {
  // Gemeistert = "memorized" and "perfected"
  const mastered = pieces.filter(
    (p) => p.progress === "memorized" || p.progress === "perfected"
  ).length;

  const todayTime = pieces.reduce((sum, p) => {
    if (!p.lastPracticed) return sum;

    const lastPracticedDate = new Date(p.lastPracticed).toDateString();
    const todayDate = new Date().toDateString();

    if (lastPracticedDate === todayDate) {
      return sum + (p.practiceTime || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Pieces</span>
        <span className="stat-value">{pieces.length}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Today</span>
        <span className="stat-value">{formatTime(todayTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Mastered</span>
        <span className="stat-value">{mastered}</span>
      </div>
    </div>
  );
}

export default StatsBar;
