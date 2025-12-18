import { useState } from "react";
import "./MoreView.css";
import packageJson from "../../../package.json";
import Header from "../Header/Header";

function MoreView({ settings, onSaveSettings, onViewHistory, onViewCalendar }) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key) => {
    const newSettings = {
      ...localSettings,
      [key]: !localSettings[key],
    };
    setLocalSettings(newSettings);
    onSaveSettings(newSettings);
  };

  const handleCountChange = (key, value) => {
    const newSettings = {
      ...localSettings,
      [key]: value,
    };
    setLocalSettings(newSettings);
    onSaveSettings(newSettings);
  };

  const handleExportData = () => {
    try {
      const data = {
        pianoPieces: JSON.parse(localStorage.getItem("pianoPieces") || "[]"),
        practiceSessions: JSON.parse(
          localStorage.getItem("practiceSessions") || "{}"
        ),
        pianoSettings: JSON.parse(
          localStorage.getItem("pianoSettings") || "{}"
        ),
        exportDate: new Date().toISOString(),
        version: packageJson.version,
      };

      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `piano-tracker-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);

        if (!data.pianoPieces || !data.practiceSessions) {
          throw new Error("Invalid backup file format");
        }

        if (confirm("This will replace all current data. Continue?")) {
          localStorage.setItem("pianoPieces", JSON.stringify(data.pianoPieces));
          localStorage.setItem(
            "practiceSessions",
            JSON.stringify(data.practiceSessions)
          );
          if (data.pianoSettings) {
            localStorage.setItem(
              "pianoSettings",
              JSON.stringify(data.pianoSettings)
            );
          }

          alert("Data imported successfully! The page will reload.");
          window.location.reload();
        }
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Header />
      <div className="more-view">
        <h1 className="more-header">⚙️ More</h1>

        {/* Version */}
        <div className="more-section">
          <div className="version-card">
            <span className="version-label">Version</span>
            <span className="version-value">{packageJson.version}</span>
          </div>
        </div>

        {/* Settings */}
        <div className="more-section">
          <h2 className="section-title">Settings</h2>
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

          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-title">Favorite Pieces Count</h3>
              <p className="setting-description">
                Number of favorite pieces to show in Practice tab
              </p>
            </div>
            <div className="count-selector">
              {[1, 3, 5, 10].map((count) => (
                <button
                  key={count}
                  className={`count-btn ${
                    localSettings.favoritePiecesCount === count ? "active" : ""
                  }`}
                  onClick={() =>
                    handleCountChange("favoritePiecesCount", count)
                  }
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Color Scheme */}
        <div className="more-section">
          <h2 className="section-title">Color Scheme</h2>
          <div className="color-schemes">
            {[
              {
                id: "ocean",
                name: "Ocean",
                colors: ["#0a0e1a", "#06b6d4", "#22d3ee"],
              },
              {
                id: "lavender",
                name: "Lavender",
                colors: ["#120a1a", "#a855f7", "#c084fc"],
              },
              {
                id: "ember",
                name: "Ember",
                colors: ["#1a0a0a", "#ef4444", "#f97316"],
              },
              {
                id: "mint",
                name: "Mint",
                colors: ["#0a1a14", "#14b8a6", "#5eead4"],
              },
              {
                id: "dusk",
                name: "Dusk",
                colors: ["#1a0a14", "#e879f9", "#f0abfc"],
              },
              {
                id: "mono",
                name: "Mono",
                colors: ["#0a0a0a", "#ffffff", "#888888"],
              },
            ].map((scheme) => (
              <button
                key={scheme.id}
                className={`color-scheme-btn ${
                  localSettings.colorScheme === scheme.id ? "active" : ""
                }`}
                onClick={() => handleCountChange("colorScheme", scheme.id)}
              >
                <div className="scheme-colors">
                  {scheme.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="scheme-color"
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <span className="scheme-name">{scheme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="more-section">
          <h2 className="section-title">Data Management</h2>
          <div className="more-buttons">
            <button className="more-btn export-btn" onClick={handleExportData}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export Backup
            </button>

            <label className="more-btn import-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Import Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* Bottom spacer for navigation bar */}
        <div className="bottom-spacer"></div>
      </div>
    </>
  );
}

export default MoreView;
