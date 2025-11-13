import "./EmptyState.css";

function EmptyState({ onAddClick }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🎵</div>
      <div className="empty-title">Noch keine Stücke</div>
      <div className="empty-text">Füge dein erstes Klavierstück hinzu!</div>
      <button className="btn btn-primary" onClick={onAddClick}>
        Erstes Stück hinzufügen
      </button>
    </div>
  );
}

export default EmptyState;
