import { useState } from "react";
import "./FilterTabs.css";

function FilterTabs({ onFilterChange, onSortChange, onSearchChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [sortReverse, setSortReverse] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter-Optionen
  const difficultyOptions = [
    { value: "all", label: "Alle Schwierigkeiten" },
    { value: "Free", label: "Free" },
    { value: "Easy", label: "Einfach" },
    { value: "Medium", label: "Mittel" },
    { value: "Hard", label: "Schwer" },
    { value: "Ultrahard", label: "Ultraschwer" },
  ];

  const progressOptions = [
    { value: "all", label: "Alle Fortschritte" },
    { value: "not_started", label: "Noch nicht begonnen" },
    { value: "hands_separate", label: "Hände einzeln" },
    { value: "hands_together", label: "Hände zusammen" },
    { value: "perfected", label: "Perfektioniert" },
    { value: "memorized", label: "Auswendig" },
  ];

  const sortOptions = [
    { value: "default", label: "Standard" },
    { value: "random", label: "Zufällig" },
    { value: "lastPracticed", label: "Zuletzt geübt" },
    { value: "progress", label: "Nach Fortschritt" },
    { value: "difficulty", label: "Nach Schwierigkeit" },
    { value: "title", label: "Nach Titel" },
    { value: "practiceTime", label: "Nach Übungszeit" },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleDifficultyChange = (value) => {
    setDifficultyFilter(value);
    onFilterChange({ difficulty: value, progress: progressFilter });
  };

  const handleProgressChange = (value) => {
    setProgressFilter(value);
    onFilterChange({ difficulty: difficultyFilter, progress: value });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange({ sortBy: value, reverse: sortReverse });
  };

  const handleSortReverseToggle = () => {
    const newReverse = !sortReverse;
    setSortReverse(newReverse);
    onSortChange({ sortBy, reverse: newReverse });
  };

  const hasActiveFilters =
    difficultyFilter !== "all" || progressFilter !== "all";

  return (
    <div className="filter-sort-container">
      {/* Suchfeld */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Suche nach Titel oder Interpret..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => {
                setSearchQuery("");
                onSearchChange("");
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter & Sort Controls */}
      <div className="controls-bar">
        <button
          className={`control-btn ${showFilters ? "active" : ""} ${
            hasActiveFilters ? "has-filters" : ""
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="control-icon">🔽</span>
          Filter
          {hasActiveFilters && <span className="active-dot"></span>}
        </button>

        <div className="sort-controls">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className={`reverse-btn ${sortReverse ? "active" : ""}`}
            onClick={handleSortReverseToggle}
            title="Sortierung umkehren"
          >
            {sortReverse ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label className="filter-label">Schwierigkeit</label>
            <div className="filter-chips">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  className={`filter-chip ${
                    difficultyFilter === option.value ? "active" : ""
                  }`}
                  onClick={() => handleDifficultyChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Fortschritt</label>
            <div className="filter-chips">
              {progressOptions.map((option) => (
                <button
                  key={option.value}
                  className={`filter-chip ${
                    progressFilter === option.value ? "active" : ""
                  }`}
                  onClick={() => handleProgressChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setDifficultyFilter("all");
                setProgressFilter("all");
                onFilterChange({ difficulty: "all", progress: "all" });
              }}
            >
              Alle Filter zurücksetzen
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterTabs;
