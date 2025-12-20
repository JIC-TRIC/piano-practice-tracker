import "./PieceCard.css";
import { formatTime } from "../../utils/youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faBullseye,
  faKeyboard,
  faStar,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

// Hilfsfunktion für Status basierend auf Meilensteinen
const getStatusFromMilestones = (milestones = []) => {
  const count = milestones.length;

  if (count === 0) {
    return { icon: faCircle, label: "Not Started", color: "#64748b" };
  } else if (count <= 2) {
    return { icon: faBullseye, label: "Learning", color: "#f59e0b" };
  } else if (count <= 4) {
    return { icon: faKeyboard, label: "Practicing", color: "#14b8a6" };
  } else if (count <= 6) {
    return { icon: faStar, label: "Polishing", color: "#06b6d4" };
  } else {
    return { icon: faWandMagicSparkles, label: "Mastered", color: "#8b5cf6" };
  }
}; // Hilfsfunktion für Schwierigkeit-Farbe
const getDifficultyColor = (difficulty) => {
  const colors = {
    Unknown: "#64748b",
    Free: "#2dd4bf",
    Easy: "#4ade80",
    Medium: "#facc15",
    Hard: "#fb923c",
    Ultrahard: "#f43f5e",
  };
  return colors[difficulty] || "#94a3b8";
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
            <span className="status-icon">
              <FontAwesomeIcon icon={status.icon} />
            </span>
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
