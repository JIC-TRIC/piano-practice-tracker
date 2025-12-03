import "./PieceCard.css";
import { formatTime } from "../../utils/youtube";

// Hilfsfunktion für Status basierend auf Meilensteinen
const getStatusFromMilestones = (milestones = []) => {
  const count = milestones.length;

  if (count === 0) {
    return { icon: "⚪", label: "Not Started", color: "#6b7280" };
  } else if (count <= 2) {
    return { icon: "🎯", label: "Learning", color: "#f59e0b" };
  } else if (count <= 4) {
    return { icon: "🎹", label: "Practicing", color: "#22c55e" };
  } else if (count <= 6) {
    return { icon: "⭐", label: "Polishing", color: "#3b82f6" };
  } else {
    return { icon: "✨", label: "Mastered", color: "#8b5cf6" };
  }
}; // Hilfsfunktion für Schwierigkeit-Farbe
const getDifficultyColor = (difficulty) => {
  const colors = {
    Unknown: "#6b7280",
    Free: "#4ade80",
    Easy: "#22c55e",
    Medium: "#fbbf24",
    Hard: "#f97316",
    Ultrahard: "#ef4444",
  };
  return colors[difficulty] || "#a1a1aa";
};

function PieceCard({ piece, sessions, onEdit, onYouTubeClick }) {
  const milestones = piece.milestones || [];
  const status = getStatusFromMilestones(milestones);
  const difficultyColor = getDifficultyColor(piece.difficulty);

  // Gesamtzeit aus practiceLog berechnen
  const totalPracticeTime = sessions.reduce(
    (sum, log) => sum + log.duration,
    0
  );

  return (
    <div className="piece-card">
      <div
        className="piece-thumbnail"
        onClick={() => onYouTubeClick(piece.youtubeUrl, piece.id)}
      >
        <img
          src={piece.thumbnail}
          alt={piece.title}
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'><rect fill='%232a2a3e' width='16' height='9'/><text x='8' y='5' text-anchor='middle' fill='%23666' font-size='3'>🎹</text></svg>";
          }}
        />
        <div className="practice-time-badge">
          {formatTime(totalPracticeTime)}
        </div>
        <div
          className="difficulty-badge"
          style={{ backgroundColor: difficultyColor }}
        >
          {piece.difficulty}
        </div>
      </div>

      <div className="piece-content" onClick={() => onEdit(piece.id)}>
        <div className="piece-header">
          <div className="piece-title">{piece.title}</div>
          <div className="piece-artist">{piece.artist}</div>
        </div>

        <div className="progress-section">
          <div className="status-display">
            <span className="status-icon">{status.icon}</span>
            <span className="status-label" style={{ color: status.color }}>
              {status.label}
            </span>
            <span className="milestone-count">({milestones.length}/8)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PieceCard;
