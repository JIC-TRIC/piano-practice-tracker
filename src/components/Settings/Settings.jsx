import { useState } from "react";
import "./Settings.css";

function Settings({ isOpen, onClose, settings, onSaveSettings }) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content settings-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">⚙️ Settings</h2>
        </div>

        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-title">External YouTube Button</h3>
              <p className="setting-description">
                Show button to open videos directly on YouTube (ad-free with
                Premium)
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.showExternalYouTubeButton}
                onChange={() => handleToggle("showExternalYouTubeButton")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save Settings
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
