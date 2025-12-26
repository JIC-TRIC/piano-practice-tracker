import { useState, useEffect } from "react";
import "./Modal.css";
import { getYouTubeThumbnail } from "../../utils/youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faHandPointRight,
  faHandPointLeft,
  faHandsClapping,
  faClock,
  faVolumeHigh,
  faStar,
  faWandMagicSparkles,
  faCircleQuestion,
  faMusic,
  faFaceSmile,
  faMeh,
  faFaceFrown,
  faSkull,
  faCircleInfo,
  faCircle,
  faPencil,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function AddEditModal({ isOpen, onClose, onSave, editingPiece }) {
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    title: "",
    artist: "",
    difficulty: "Unknown",
    milestones: [],
    notesState: "not_learned",
  });
  const [showDifficultyInfo, setShowDifficultyInfo] = useState(false);
  const [showMilestoneInfo, setShowMilestoneInfo] = useState(false);

  // Schwierigkeitsgrad-Beschreibungen
  const difficultyDescriptions = {
    Unknown: "Difficulty not yet assessed",
    Free: "Can play the piece fluently with both hands without significant errors",
    Easy: "Can play the piece safely with both hands, but not completely perfect",
    Medium:
      "Can play both hands separately well, but both hands together is still difficult",
    Hard: "Can play both hands separately with some errors, both hands together barely possible",
    Ultrahard:
      "Cannot play either hand separately, both hands together impossible",
  };

  // Meilenstein-Beschreibungen
  const milestoneDescriptions = {
    left_hand: "Can play left hand at reduced tempo",
    right_hand: "Can play right hand at reduced tempo",
    left_hand_full: "Can play left hand at full speed",
    right_hand_full: "Can play right hand at full speed",
    hands_together: "Can play both hands together at reduced tempo",
    tempo_reached: "Can play both hands together at full speed",
    dynamics_added: "Proper dynamics (volume, touch) added",
    memorized: "Can play the piece from memory",
  };

  // Meilenstein-Optionen
  const milestoneOptions = [
    { id: "left_hand", label: "Left Hand Slow", icon: faHandPointLeft },
    { id: "right_hand", label: "Right Hand Slow", icon: faHandPointRight },
    { id: "left_hand_full", label: "Left Hand Full", icon: faHandPointLeft },
    { id: "right_hand_full", label: "Right Hand Full", icon: faHandPointRight },
    { id: "hands_together", label: "Together Slow", icon: faHandsClapping },
    { id: "tempo_reached", label: "Full Speed", icon: faClock },
    { id: "dynamics_added", label: "Dynamics", icon: faVolumeHigh },
    { id: "memorized", label: "Memorized", icon: faWandMagicSparkles },
  ];

  useEffect(() => {
    if (editingPiece) {
      setFormData({
        ...editingPiece,
        milestones: editingPiece.milestones || [],
        notesState:
          editingPiece.notesState ||
          (editingPiece.notesLearned ? "learned" : "not_learned"),
      });
    } else {
      setFormData({
        youtubeUrl: "",
        title: "",
        artist: "",
        difficulty: "Unknown",
        milestones: [],
        notesState: "not_learned",
      });
    }
  }, [editingPiece, isOpen]);

  // Verhindere Body-Scroll wenn Modal geöffnet ist
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData((prev) => ({
        ...prev,
        youtubeUrl: text,
      }));
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      alert("Clipboard access denied. Please paste manually.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pieceData = {
      ...formData,
      thumbnail: getYouTubeThumbnail(formData.youtubeUrl),
    };
    onSave(pieceData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMilestone = (milestoneId) => {
    setFormData((prev) => {
      const milestones = prev.milestones || [];
      const newMilestones = milestones.includes(milestoneId)
        ? milestones.filter((id) => id !== milestoneId)
        : [...milestones, milestoneId];
      return { ...prev, milestones: newMilestones };
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {editingPiece ? "Stück bearbeiten" : "Neues Stück hinzufügen"}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">YouTube Link</label>
            <div className="input-with-button">
              <input
                type="url"
                className="form-input"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
              <button
                type="button"
                className="btn-paste"
                onClick={handlePasteFromClipboard}
                title="Paste from clipboard"
              >
                📋
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Interpret</label>
            <input
              type="text"
              className="form-input"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="form-label-with-info">
              <label className="form-label">Difficulty</label>
              <button
                type="button"
                className="info-btn"
                onClick={() => setShowDifficultyInfo(true)}
                title="Show difficulty explanations"
              >
                <FontAwesomeIcon icon={faCircleInfo} />
              </button>
            </div>
            <div className="segmented-control">
              <button
                type="button"
                className={`segment-btn ${
                  formData.difficulty === "Unknown" ? "active" : ""
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "difficulty", value: "Unknown" },
                  })
                }
              >
                <span className="segment-icon">
                  <FontAwesomeIcon icon={faCircleQuestion} />
                </span>
                <span className="segment-label">Unknown</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${
                  formData.difficulty === "Free" ? "active" : ""
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "difficulty", value: "Free" },
                  })
                }
              >
                <span className="segment-icon">
                  <FontAwesomeIcon icon={faMusic} />
                </span>
                <span className="segment-label">Free</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${
                  formData.difficulty === "Easy" ? "active" : ""
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "difficulty", value: "Easy" },
                  })
                }
              >
                <span className="segment-icon">
                  <FontAwesomeIcon icon={faFaceSmile} />
                </span>
                <span className="segment-label">Easy</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${
                  formData.difficulty === "Medium" ? "active" : ""
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "difficulty", value: "Medium" },
                  })
                }
              >
                <span className="segment-icon">
                  <FontAwesomeIcon icon={faMeh} />
                </span>
                <span className="segment-label">Medium</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${
                  formData.difficulty === "Hard" ? "active" : ""
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "difficulty", value: "Hard" },
                  })
                }
              >
                <span className="segment-icon">
                  <FontAwesomeIcon icon={faFaceFrown} />
                </span>
                <span className="segment-label">Hard</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${
                  formData.difficulty === "Ultrahard" ? "active" : ""
                }`}
                onClick={() =>
                  handleChange({
                    target: { name: "difficulty", value: "Ultrahard" },
                  })
                }
              >
                <span className="segment-icon">
                  <FontAwesomeIcon icon={faSkull} />
                </span>
                <span className="segment-label">Ultra</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tutorial Notes</label>
            <div className="notes-segments">
              <button
                type="button"
                className={`notes-segment-btn ${
                  formData.notesState === "not_learned" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    notesState: "not_learned",
                  }))
                }
              >
                <span className="notes-icon">
                  <FontAwesomeIcon icon={faCircle} />
                </span>
                <span className="notes-text">Not Learned</span>
              </button>
              <button
                type="button"
                className={`notes-segment-btn ${
                  formData.notesState === "learned" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    notesState: "learned",
                  }))
                }
              >
                <span className="notes-icon">
                  <FontAwesomeIcon icon={faFileLines} />
                </span>
                <span className="notes-text">Notes Learned</span>
              </button>
              <button
                type="button"
                className={`notes-segment-btn ${
                  formData.notesState === "own_version" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    notesState: "own_version",
                  }))
                }
              >
                <span className="notes-icon">
                  <FontAwesomeIcon icon={faPencil} />
                </span>
                <span className="notes-text">Own Version</span>
              </button>
            </div>
            <p className="notes-help-text">
              {formData.notesState === "not_learned" &&
                "You haven't started studying the notes yet"}
              {formData.notesState === "learned" &&
                "You've studied all notes and are learning to play them"}
              {formData.notesState === "own_version" &&
                "You're creating your own easier/better version"}
            </p>
          </div>

          <div className="form-group">
            <div className="form-label-with-info">
              <label className="form-label">
                Milestones ({formData.milestones?.length || 0}/8)
              </label>
              <button
                type="button"
                className="info-btn"
                onClick={() => setShowMilestoneInfo(true)}
                title="Show milestone explanations"
              >
                <FontAwesomeIcon icon={faCircleInfo} />
              </button>
            </div>
            <div className="segmented-control" style={{ flexWrap: "wrap" }}>
              {milestoneOptions.map((milestone) => (
                <button
                  key={milestone.id}
                  type="button"
                  className={`segment-btn ${
                    formData.milestones?.includes(milestone.id) ? "active" : ""
                  }`}
                  onClick={() => toggleMilestone(milestone.id)}
                  style={{ flex: "1 1 calc(25% - 0.281rem)", minWidth: 0 }}
                >
                  <span className="segment-icon">
                    <FontAwesomeIcon icon={milestone.icon} />
                  </span>
                  <span className="segment-label">{milestone.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Safe
            </button>
          </div>
        </form>
      </div>

      {/* Difficulty Info Overlay */}
      {showDifficultyInfo && (
        <div
          className="difficulty-info-overlay"
          onClick={() => setShowDifficultyInfo(false)}
        >
          <div
            className="difficulty-info-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="difficulty-info-header">
              <h3>Difficulty Levels</h3>
              <button
                className="close-info-btn"
                onClick={() => setShowDifficultyInfo(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="difficulty-info-list">
              {Object.entries(difficultyDescriptions).map(
                ([level, description]) => (
                  <div key={level} className="difficulty-info-item">
                    <div className="difficulty-info-level">
                      <span className="difficulty-icon">
                        <FontAwesomeIcon
                          icon={
                            level === "Unknown"
                              ? faCircleQuestion
                              : level === "Free"
                              ? faMusic
                              : level === "Easy"
                              ? faFaceSmile
                              : level === "Medium"
                              ? faMeh
                              : level === "Hard"
                              ? faFaceFrown
                              : faSkull
                          }
                        />
                      </span>
                      <span className="difficulty-name">{level}</span>
                    </div>
                    <p className="difficulty-description">{description}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Milestone Info Overlay */}
      {showMilestoneInfo && (
        <div
          className="difficulty-info-overlay"
          onClick={() => setShowMilestoneInfo(false)}
        >
          <div
            className="difficulty-info-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="difficulty-info-header">
              <h3>Progress Milestones</h3>
              <button
                className="close-info-btn"
                onClick={() => setShowMilestoneInfo(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="difficulty-info-list">
              {milestoneOptions.map((milestone) => (
                <div key={milestone.id} className="difficulty-info-item">
                  <div className="difficulty-info-level">
                    <span className="difficulty-icon">
                      <FontAwesomeIcon icon={milestone.icon} />
                    </span>
                    <span className="difficulty-name">{milestone.label}</span>
                  </div>
                  <p className="difficulty-description">
                    {milestoneDescriptions[milestone.id]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddEditModal;
