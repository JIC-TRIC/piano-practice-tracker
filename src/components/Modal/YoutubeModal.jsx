import "./Modal.css";
import { extractVideoId } from "../../utils/youtube";

function YouTubeModal({ isOpen, onClose, videoUrl }) {
  if (!isOpen) return null;

  const videoId = extractVideoId(videoUrl);

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content" style={{ maxWidth: "800px" }}>
        <div className="modal-header">
          <h2 className="modal-title">YouTube Video</h2>
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
          <button className="btn btn-secondary" onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

export default YouTubeModal;
