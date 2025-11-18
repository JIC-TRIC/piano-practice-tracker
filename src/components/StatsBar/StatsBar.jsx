import "./StatsBar.css";
import { formatTime } from "../../utils/youtube";

function StatsBar({ pieces }) {
  // Hilfsfunktion: Prüft ob zwei Daten am selben Tag sind
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Gemeistert = "memorized" und "perfected"
  const mastered = pieces.filter(
    (p) => p.progress === "memorized" || p.progress === "perfected"
  ).length;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Zeit heute berechnen (aus practiceLog)
  const todayTime = pieces.reduce((sum, piece) => {
    if (!piece.practiceLog || piece.practiceLog.length === 0) return sum;

    const todaySessions = piece.practiceLog.filter((log) =>
      isSameDay(new Date(log.timestamp), today)
    );

    return sum + todaySessions.reduce((acc, log) => acc + log.duration, 0);
  }, 0);

  // Zeit gestern berechnen (aus practiceLog)
  const yesterdayTime = pieces.reduce((sum, piece) => {
    if (!piece.practiceLog || piece.practiceLog.length === 0) return sum;

    const yesterdaySessions = piece.practiceLog.filter((log) =>
      isSameDay(new Date(log.timestamp), yesterday)
    );

    return sum + yesterdaySessions.reduce((acc, log) => acc + log.duration, 0);
  }, 0);

  // Gesamtzeit berechnen (aus practiceLog)
  const totalTime = pieces.reduce((sum, piece) => {
    if (!piece.practiceLog || piece.practiceLog.length === 0) return sum;

    return sum + piece.practiceLog.reduce((acc, log) => acc + log.duration, 0);
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
        <span className="stat-label">Yesterday</span>
        <span className="stat-value">{formatTime(yesterdayTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Total</span>
        <span className="stat-value">{formatTime(totalTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Mastered</span>
        <span className="stat-value">{mastered}</span>
      </div>
    </div>
  );
}

export default StatsBar;
