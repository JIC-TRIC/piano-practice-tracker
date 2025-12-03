import { useState, useEffect } from "react";
import "./Modal.css";
import { getYouTubeThumbnail } from "../../utils/youtube";

function AddEditModal({ isOpen, onClose, onSave, editingPiece }) {
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    title: "",
    artist: "",
    difficulty: "Unknown",
    progress: "not_started",
  });

  // Fortschritt-Optionen
  const progressOptions = [
    { value: "not_started", label: "Not Started" },
    { value: "learning_notes", label: "Learning Notes" },
    { value: "hands_separate", label: "Hands Separate" },
    { value: "slow_hands_together", label: "Slow Hands Together" },
    { value: "building_speed", label: "Building Speed" },
    { value: "practicing_dynamics", label: "Refining Details" },
    { value: "performance_ready", label: "Performance Ready" },
    { value: "memorized", label: "Memorized" },
  ];

  useEffect(() => {
    if (editingPiece) {
      setFormData(editingPiece);
    } else {
      setFormData({
        youtubeUrl: "",
        title: "",
        artist: "",
        difficulty: "Unknown",
        progress: "not_started",
      });
    }
  }, [editingPiece, isOpen]);

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
            <label className="form-label">Difficulty</label>
            <select
              className="form-input"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Unknown">Unknown</option>
              <option value="Free">Free</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Ultrahard">Ultrahard</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Progress</label>
            <select
              className="form-input"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              required
            >
              {progressOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
    </div>
  );
}

export default AddEditModal;
