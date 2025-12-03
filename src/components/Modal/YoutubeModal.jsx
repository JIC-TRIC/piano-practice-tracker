import { useState, useEffect, useRef } from "react";
import "./Modal.css";
import { extractVideoId, formatTimerDisplay } from "../../utils/youtube";

function YouTubeModal({
  isOpen,
  onClose,
  videoUrl,
  piece,
  onSavePracticeTime,
  onUpdateProgress,
  settings,
}) {
  const [seconds, setSeconds] = useState(0);
  const [player, setPlayer] = useState(null);
  const [selectedMilestones, setSelectedMilestones] = useState([]);
  const intervalRef = useRef(null);
  const playerRef = useRef(null);
  const startTimeRef = useRef(null);

  const milestoneOptions = [
    { id: "notes_learned", label: "Notes Learned" },
    { id: "right_hand", label: "Right Hand Mastered" },
    { id: "left_hand", label: "Left Hand Mastered" },
    { id: "hands_together", label: "Hands Together" },
    { id: "tempo_reached", label: "Target Tempo Reached" },
    { id: "dynamics_added", label: "Dynamics Added" },
    { id: "performance_ready", label: "Performance Ready" },
    { id: "memorized", label: "Memorized" },
  ];

  // Initialize selectedMilestones when modal opens
  useEffect(() => {
    if (isOpen && piece) {
      setSelectedMilestones(piece.milestones || []);
    }
  }, [isOpen, piece]);

  // Load YouTube IFrame API
  useEffect(() => {
    // Only load API if we're showing the player
    if (settings?.showExternalYouTubeButton) {
      return;
    }

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      return;
    }

    // Load the IFrame Player API code asynchronously
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // API ready callback
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API ready");
    };
  }, [settings]);

  // Initialize player when modal opens (only if not showing external button)
  useEffect(() => {
    if (!isOpen || settings?.showExternalYouTubeButton) return;

    const videoId = extractVideoId(videoUrl);
    if (!videoId) return;

    // Wait for API to be ready
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }

      // Create player
      const newPlayer = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            setPlayer(event.target);
          },
        },
      });
    };

    initPlayer();

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [isOpen, videoUrl, settings]);

  // Start timer when modal opens
  useEffect(() => {
    if (isOpen) {
      // Speichere Startzeit
      startTimeRef.current = Date.now();
      setSeconds(0);

      // Update Timer basierend auf verstrichener Zeit
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSeconds(elapsed);
      }, 1000);
    }

    // Cleanup: stop timer when modal closes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      startTimeRef.current = null;
    };
  }, [isOpen]);

  // Zusätzlicher Effect: Update bei visibility change (App wird wieder aktiv)
  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && startTimeRef.current) {
        // App ist wieder aktiv - berechne korrekte Zeit
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSeconds(elapsed);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isOpen]);

  const toggleMilestone = (milestoneId) => {
    setSelectedMilestones((prev) =>
      prev.includes(milestoneId)
        ? prev.filter((id) => id !== milestoneId)
        : [...prev, milestoneId]
    );
  };

  const handleCloseWithoutSaving = () => {
    onClose();
  };

  const handleClose = () => {
    if (seconds > 0 && piece) {
      onSavePracticeTime(piece.id, seconds, new Date().toISOString());
    }
    const milestonesChanged =
      JSON.stringify(selectedMilestones) !==
      JSON.stringify(piece?.milestones || []);
    if (milestonesChanged) {
      onUpdateProgress(piece.id, selectedMilestones);
    }
    onClose();
  };

  const handleOpenInYouTube = () => {
    window.open(videoUrl, "_blank");
  };

  if (!isOpen) return null;

  const videoId = extractVideoId(videoUrl);

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content youtube-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{piece?.title || "YouTube Video"}</h2>
          <div className="timer-display">⏱️ {formatTimerDisplay(seconds)}</div>
        </div>

        {/* Milestone Selector */}
        <div className="form-group">
          <label className="form-label">
            Milestones ({selectedMilestones.length}/8)
          </label>
          <div className="milestone-list">
            {milestoneOptions.map((milestone) => (
              <label
                key={milestone.id}
                className="milestone-item"
                onClick={() => toggleMilestone(milestone.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedMilestones.includes(milestone.id)}
                  onChange={() => {}}
                  className="milestone-checkbox"
                />
                <span className="milestone-label">{milestone.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Show either external button OR YouTube player */}
        {settings?.showExternalYouTubeButton ? (
          <button
            className="btn-open-youtube"
            onClick={handleOpenInYouTube}
            title="Open in YouTube (ad-free with Premium)"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Open in YouTube
          </button>
        ) : (
          videoId && (
            <div className="video-container">
              <div id="youtube-player"></div>
            </div>
          )
        )}

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleClose}>
            Close and Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCloseWithoutSaving}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default YouTubeModal;
