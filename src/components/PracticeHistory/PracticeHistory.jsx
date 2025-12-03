import { useMemo } from "react";
import "./PracticeHistory.css";
import { formatTime } from "../../utils/youtube";

function PracticeHistory({ isOpen, onClose, pieces, practiceSessions }) {
  const sessionHistory = useMemo(() => {
    const allSessions = [];

    // Sammle alle Sessions mit Piece-Infos
    Object.entries(practiceSessions).forEach(([pieceId, sessions]) => {
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece) return;

      sessions.forEach((session) => {
        allSessions.push({
          ...session,
          pieceId,
          pieceTitle: piece.title,
          pieceArtist: piece.artist,
        });
      });
    });

    // Sortiere nach Datum (neueste zuerst)
    return allSessions.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [pieces, practiceSessions]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalTime = useMemo(() => {
    return sessionHistory.reduce((sum, session) => sum + session.duration, 0);
  }, [sessionHistory]);

  const groupedSessions = useMemo(() => {
    const groups = {};
    sessionHistory.forEach((session) => {
      const dateKey = new Date(session.timestamp).toLocaleDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });
    return groups;
  }, [sessionHistory]);

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content history-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">📊 Practice History</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="history-stats">
          <div className="stat-card">
            <div className="stat-label">Total Sessions</div>
            <div className="stat-value">{sessionHistory.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Time</div>
            <div className="stat-value">{formatTime(totalTime)}</div>
          </div>
        </div>

        <div className="history-list">
          {Object.entries(groupedSessions).map(([dateKey, sessions]) => (
            <div key={dateKey} className="history-group">
              <div className="group-header">
                <h3 className="group-date">
                  {formatDate(sessions[0].timestamp)}
                </h3>
                <span className="group-count">{sessions.length} sessions</span>
              </div>
              <div className="session-items">
                {sessions.map((session, index) => (
                  <div
                    key={`${session.timestamp}-${index}`}
                    className="session-item"
                  >
                    <div className="session-icon">🎹</div>
                    <div className="session-info">
                      <div className="session-piece">
                        <span className="piece-title">
                          {session.pieceTitle}
                        </span>
                        <span className="piece-artist">
                          {session.pieceArtist}
                        </span>
                      </div>
                      <div className="session-time">
                        {formatDateTime(session.timestamp)}
                      </div>
                    </div>
                    <div className="session-duration">
                      {formatTime(session.duration)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {sessionHistory.length === 0 && (
            <div className="empty-history">
              <p>
                No practice sessions yet. Start practicing to see your history!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PracticeHistory;
