import { useState, useEffect, useRef } from "react";
import "./Modal.css";
import { extractVideoId, formatTimerDisplay } from "../../utils/youtube";

function YouTubeModal({
  isOpen,
  onClose,
  videoUrl,
  pieceId,
  onSavePracticeTime,
}) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  // Start timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setSeconds(0);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // Cleanup: stop timer when modal closes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (seconds > 0) {
      // Übergebe auch den Timestamp, wann geübt wurde
      onSavePracticeTime(pieceId, seconds, new Date().toISOString());
    }
    onClose();
  };

  if (!isOpen) return null;

  const videoId = extractVideoId(videoUrl);

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content" style={{ maxWidth: "800px" }}>
        <div className="modal-header">
          <h2 className="modal-title">YouTube Video</h2>
          <div
            className="timer-display"
            style={{ fontSize: "1rem", marginLeft: "auto" }}
          >
            ⏱️ {formatTimerDisplay(seconds)}
          </div>
        </div>
        {videoId && (
          <iframe
            width="100%"
            height="450"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        <div style={{ marginTop: "1rem" }}>
          <button className="btn btn-secondary" onClick={handleClose}>
            Schließen und Zeit speichern
          </button>
        </div>
      </div>
    </div>
  );
}

export default YouTubeModal;
