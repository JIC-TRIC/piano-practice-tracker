import "./PieceCard.css";
import { formatTime } from "../../utils/youtube";

function PieceCard({ piece, onEdit, onDelete, onYouTubeClick }) {
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
          {formatTime(piece.practiceTime || 0)}
        </div>
      </div>
      <div className="piece-content">
        <div className="piece-title">{piece.title}</div>
        <div className="piece-artist">{piece.artist}</div>

        <div className="piece-difficulty">
          Schwierigkeit: {piece.difficulty}
        </div>

        <div className="progress-container">
          <div className="progress-label">
            <span>Fortschritt</span>
            <span>{piece.progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${piece.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="piece-actions">
          <button className="action-btn" onClick={() => onEdit(piece.id)}>
            ✏️ Edit
          </button>
          <button className="action-btn" onClick={() => onDelete(piece.id)}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default PieceCard;
