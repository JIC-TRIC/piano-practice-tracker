import "./Header.css";

function Header({ onAddClick }) {
  return (
    <div className="app-header">
      <div className="header-content">
        <h1 className="app-title">🎹 Piano Tracker</h1>
        <button className="add-btn" onClick={onAddClick}>
          +
        </button>
      </div>
    </div>
  );
}

export default Header;
