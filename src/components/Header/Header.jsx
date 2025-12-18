import "./Header.css";

function Header() {
  return (
    <div className="app-header">
      <div className="header-content">
        <div className="logo">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 2H4V22H9V2Z" fill="currentColor" />
            <path d="M20 2H15V14H20V2Z" fill="currentColor" />
            <rect x="6" y="2" width="2" height="10" fill="var(--background)" />
            <rect x="17" y="2" width="2" height="8" fill="var(--background)" />
          </svg>
          <h1 className="app-title">Piano Tracker</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
