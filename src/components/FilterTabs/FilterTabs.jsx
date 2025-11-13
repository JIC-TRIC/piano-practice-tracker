import "./FilterTabs.css";

function FilterTabs({ currentFilter, onFilterChange }) {
  const filters = [
    { value: "all", label: "Alle" },
    { value: "learning", label: "Am Lernen" },
    { value: "mastered", label: "Gemeistert" },
    { value: "Free", label: "Free" },
    { value: "Easy", label: "Einfach" },
    { value: "Medium", label: "Mittel" },
    { value: "Hard", label: "Schwer" },
    { value: "Ultrahard", label: "Ultraschwer" },
  ];

  return (
    <div className="filter-tabs">
      {filters.map((filter) => (
        <div
          key={filter.value}
          className={`filter-tab ${
            currentFilter === filter.value ? "active" : ""
          }`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
}

export default FilterTabs;
