import { useState, useEffect } from "react";
import "./Modal.css";
import { getYouTubeThumbnail } from "../../utils/youtube";

function AddEditModal({ isOpen, onClose, onSave, editingPiece }) {
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    title: "",
    artist: "",
    difficulty: "Medium",
    progress: "not_started", // Geändert von 0 zu "not_started"
  });

  // Fortschritt-Optionen
  const progressOptions = [
    { value: "not_started", label: "Noch nicht begonnen" },
    { value: "hands_separate", label: "Hände einzeln" },
    { value: "hands_together", label: "Hände zusammen" },
    { value: "perfected", label: "Perfektioniert" },
    { value: "memorized", label: "Auswendig" },
  ];

  useEffect(() => {
    if (editingPiece) {
      setFormData(editingPiece);
    } else {
      setFormData({
        youtubeUrl: "",
        title: "",
        artist: "",
        difficulty: "Medium",
        progress: "not_started",
      });
    }
  }, [editingPiece, isOpen]);

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
            <input
              type="url"
              className="form-input"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Titel</label>
            <input
              type="text"
              className="form-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="z.B. River Flows in You"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Interpret / Komponist</label>
            <input
              type="text"
              className="form-input"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              placeholder="z.B. Yiruma"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Schwierigkeit</label>
            <select
              className="form-input"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Free">Free</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Ultrahard">Ultrahard</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fortschritt</label>
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
              Abbrechen
            </button>
            <button type="submit" className="btn btn-primary">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditModal;
