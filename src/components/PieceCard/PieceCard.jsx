import "./PieceCard.css";
import { formatTime } from "../../utils/youtube";

// Hilfsfunktion für Fortschritt-Label
const getProgressLabel = (progress) => {
  const labels = {
    not_started: "Not Started",
    learning_notes: "Learning Notes",
    hands_separate: "Hands Separately",
    slow_hands_together: "Slow Together",
    building_speed: "Building Speed",
    practicing_dynamics: "Refining Details",
    performance_ready: "Performance Ready",
    memorized: "Memorized",
  };
  return labels[progress] || "Unknown";
};

// Hilfsfunktion für Fortschritt-Prozent (für Progressbar)
const getProgressPercentage = (progress) => {
  const percentages = {
    not_started: 0,
    learning_notes: 12,
    hands_separate: 25,
    slow_hands_together: 40,
    building_speed: 55,
    practicing_dynamics: 70,
    performance_ready: 85,
    memorized: 100,
  };
  return percentages[progress] || 0;
};

// Hilfsfunktion für Fortschritt-Farbe - Gelb → Grün → Blau → Lila
const getProgressColor = (percentage) => {
  if (percentage === 0) {
    return "linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)"; // Grau - nicht begonnen
  } else if (percentage <= 12) {
    return "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)"; // Orange/Gelb - Learning Notes
  } else if (percentage <= 25) {
    return "linear-gradient(90deg, #fbbf24 0%, #fcd34d 100%)"; // Gelb - Hands Separate
  } else if (percentage <= 40) {
    return "linear-gradient(90deg, #84cc16 0%, #a3e635 100%)"; // Lime - Slow Together
  } else if (percentage <= 55) {
    return "linear-gradient(90deg, #22c55e 0%, #4ade80 100%)"; // Grün - Building Speed
  } else if (percentage <= 70) {
    return "linear-gradient(90deg, #14b8a6 0%, #2dd4bf 100%)"; // Teal - Practicing Dynamics
  } else if (percentage <= 85) {
    return "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)"; // Blau - Performance Ready
  } else {
    return "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)"; // Lila - Memorized
  }
};

// Hilfsfunktion für Schwierigkeit-Farbe
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
  const progressPercentage = getProgressPercentage(piece.progress);
  const progressColor = getProgressColor(progressPercentage);
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
