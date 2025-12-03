import { useState, useEffect, useRef } from "react";
import "./Modal.css";
import { extractVideoId, formatTimerDisplay } from "../../utils/youtube";

function YouTubeModal({
  isOpen,
  onClose,
  videoUrl,
  pieceId,
  onSavePracticeTime,
  settings,
}) {
  const [seconds, setSeconds] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [player, setPlayer] = useState(null);
  const intervalRef = useRef(null);
  const playerRef = useRef(null);
  const startTimeRef = useRef(null);

  const speedOptions = [
    { value: 0.25, label: "0.25x" },
    { value: 0.5, label: "0.5x" },
    { value: 0.6, label: "0.6x" },
    { value: 0.7, label: "0.7x" },
    { value: 0.75, label: "0.75x" },
    { value: 0.8, label: "0.8x" },
    { value: 0.9, label: "0.9x" },
    { value: 1, label: "1x" },
    { value: 1.25, label: "1.25x" },
  ];

  // Load YouTube IFrame API
  useEffect(() => {
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
  }, []);

  // Initialize player when modal opens
  useEffect(() => {
    if (!isOpen) return;

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
            // Set initial playback rate
            event.target.setPlaybackRate(playbackRate);
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
  }, [isOpen, videoUrl]);

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

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (player && player.setPlaybackRate) {
      player.setPlaybackRate(speed);
    }
  };

  const handleCloseWithoutSaving = () => {
    onClose();
  };

  const handleClose = () => {
    if (seconds > 0) {
      onSavePracticeTime(pieceId, seconds, new Date().toISOString());
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
          <h2 className="modal-title">YouTube Video</h2>
          <div className="timer-display">⏱️ {formatTimerDisplay(seconds)}</div>
        </div>

        {/* Open in YouTube Button */}
        {settings?.showExternalYouTubeButton && (
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
        )}

        {/* Playback Speed Controls */}
        <div className="playback-speed-controls">
          <label className="speed-label">Playback Speed:</label>
          <div className="speed-buttons">
            {speedOptions.map((option) => (
              <button
                key={option.value}
                className={`speed-btn ${
                  playbackRate === option.value ? "active" : ""
                }`}
                onClick={() => handleSpeedChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* YouTube Player */}
        {videoId && (
          <div className="video-container">
            <div id="youtube-player"></div>
          </div>
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
