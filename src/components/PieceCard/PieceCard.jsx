import "./PieceCard.css";
import { formatTime } from "../../utils/youtube";

// Hilfsfunktion für Fortschritt-Label
const getProgressLabel = (progress) => {
  const labels = {
    not_started: "Not Started",
    hands_separate: "Hands Separately",
    hands_together: "Hands Together",
    perfected: "Perfected",
    memorized: "Memorized",
  };
  return labels[progress] || "Unknown";
};

// Hilfsfunktion für Fortschritt-Prozent (für Progressbar)
const getProgressPercentage = (progress) => {
  const percentages = {
    not_started: 0,
    hands_separate: 25,
    hands_together: 50,
    perfected: 75,
    memorized: 100,
  };
  return percentages[progress] || 0;
};

// Hilfsfunktion für Fortschritt-Farbe - Gelb → Grün → Blau → Lila
const getProgressColor = (percentage) => {
  if (percentage === 0) {
    return "linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)"; // Grau - nicht begonnen
  } else if (percentage <= 25) {
    return "linear-gradient(90deg, #fbbf24 0%, #fcd34d 100%)"; // Gelb - einzelne Hände
  } else if (percentage <= 50) {
    return "linear-gradient(90deg, #22c55e 0%, #4ade80 100%)"; // Grün - zusammen spielbar
  } else if (percentage <= 75) {
    return "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)"; // Blau - perfektioniert
  } else {
    return "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)"; // Lila - auswendig gemeistert
  }
};

// Hilfsfunktion für Schwierigkeit-Farbe
const getDifficultyColor = (difficulty) => {
  const colors = {
    Free: "#4ade80",
    Easy: "#22c55e",
    Medium: "#fbbf24",
    Hard: "#f97316",
    Ultrahard: "#ef4444",
  };
  return colors[difficulty] || "#a1a1aa";
};

function PieceCard({ piece, onEdit, onYouTubeClick }) {
  const progressPercentage = getProgressPercentage(piece.progress);
  const progressColor = getProgressColor(progressPercentage);
  const difficultyColor = getDifficultyColor(piece.difficulty);

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
        <div className="thumbnail-overlay">
          <div className="play-icon">▶</div>
        </div>
        <div className="practice-time-badge">
          {formatTime(piece.practiceTime || 0)}
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
          <div className="progress-text">
            {getProgressLabel(piece.progress)}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercentage}%`,
                background: progressColor,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PieceCard;
