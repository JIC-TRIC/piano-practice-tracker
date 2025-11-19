import "./StatsBar.css";
import { formatTime } from "../../utils/youtube";

// Hilfsfunktion: Prüft ob zwei Daten am selben Tag sind
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

function StatsBar({ pieces, practiceSessions }) {
  // Gemeistert = "memorized" und "perfected"
  const mastered = pieces.filter(
    (p) => p.progress === "memorized" || p.progress === "perfected"
  ).length;

  const today = new Date();

  // Zeit heute berechnen (aus allen Sessions aller Stücke)
  const todayTime = Object.values(practiceSessions)
    .flat()
    .filter((log) => isSameDay(new Date(log.timestamp), today))
    .reduce((sum, log) => sum + log.duration, 0);

  // Gesamtzeit berechnen (alle Sessions von allen Stücken)
  const totalTime = Object.values(practiceSessions)
    .flat()
    .reduce((sum, log) => sum + log.duration, 0);

  // Funktion zum Formatieren in Stunden
  const formatHours = (seconds) => {
    const hours = (seconds / 3600).toFixed(1);
    return `${hours}h`;
  };

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
        <span className="stat-label">Total</span>
        <span className="stat-value">{formatHours(totalTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Mastered</span>
        <span className="stat-value">{mastered}</span>
      </div>
    </div>
  );
}

export default StatsBar;
