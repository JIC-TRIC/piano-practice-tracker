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
    { value: "all", label: "All Difficulties" },
    { value: "Free", label: "Free" },
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" },
    { value: "Ultrahard", label: "Ultrahard" },
  ];

  const progressOptions = [
    { value: "all", label: "All Progress Levels" },
    { value: "not_started", label: "Not Started" },
    { value: "hands_separate", label: "Hands Separately" },
    { value: "hands_together", label: "Hands Together" },
    { value: "perfected", label: "Perfected" },
    { value: "memorized", label: "Memorized" },
  ];

  const sortOptions = [
    { value: "default", label: "Date Added" },
    { value: "trending", label: "Trending" }, // NEU
    { value: "random", label: "Random" },
    { value: "lastPracticed", label: "Last Practiced" },
    { value: "progress", label: "Progress" },
    { value: "difficulty", label: "Difficulty" },
    { value: "title", label: "Title" },
    { value: "practiceTime", label: "Practice Time" },
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
      {/* Search Bar mit Filter Button */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or artist..."
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

        <button
          className={`filter-btn ${showFilters ? "active" : ""} ${
            hasActiveFilters ? "has-filters" : ""
          }`}
          onClick={() => setShowFilters(!showFilters)}
          title="Filter options"
        >
          <span className="filter-icon">🔽</span>
          {hasActiveFilters && <span className="active-dot"></span>}
        </button>
      </div>

      {/* Sort Controls */}
      <div className="controls-bar">
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
            title="Reverse order"
          >
            {sortReverse ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label className="filter-label">Difficulty</label>
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
            <label className="filter-label">Progress</label>
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
              Reset all Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterTabs;
