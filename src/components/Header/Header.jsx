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
            className="piano-keyboard"
          >
            {/* Piano base */}
            <rect
              x="2"
              y="6"
              width="20"
              height="16"
              rx="2"
              fill="var(--surface)"
              stroke="var(--primary)"
              strokeWidth="1"
            />

            {/* White keys */}
            <rect
              x="3"
              y="8"
              width="2.5"
              height="12"
              fill="var(--surface-light)"
              stroke="var(--primary)"
              strokeWidth="0.5"
              rx="0.5"
            />
            <rect
              x="6"
              y="8"
              width="2.5"
              height="12"
              fill="var(--surface-light)"
              stroke="var(--primary)"
              strokeWidth="0.5"
              rx="0.5"
            />
            <rect
              x="9"
              y="8"
              width="2.5"
              height="12"
              fill="var(--surface-light)"
              stroke="var(--primary)"
              strokeWidth="0.5"
              rx="0.5"
            />
            <rect
              x="12"
              y="8"
              width="2.5"
              height="12"
              fill="var(--surface-light)"
              stroke="var(--primary)"
              strokeWidth="0.5"
              rx="0.5"
            />
            <rect
              x="15"
              y="8"
              width="2.5"
              height="12"
              fill="var(--surface-light)"
              stroke="var(--primary)"
              strokeWidth="0.5"
              rx="0.5"
            />
            <rect
              x="18"
              y="8"
              width="2.5"
              height="12"
              fill="var(--surface-light)"
              stroke="var(--primary)"
              strokeWidth="0.5"
              rx="0.5"
            />

            {/* Black keys */}
            <rect
              x="4.5"
              y="8"
              width="1.5"
              height="7"
              fill="var(--primary)"
              rx="0.3"
            />
            <rect
              x="7.5"
              y="8"
              width="1.5"
              height="7"
              fill="var(--primary)"
              rx="0.3"
            />
            <rect
              x="13.5"
              y="8"
              width="1.5"
              height="7"
              fill="var(--primary)"
              rx="0.3"
            />
            <rect
              x="16.5"
              y="8"
              width="1.5"
              height="7"
              fill="var(--primary)"
              rx="0.3"
            />
            <rect
              x="19.5"
              y="8"
              width="1.5"
              height="7"
              fill="var(--primary)"
              rx="0.3"
            />
          </svg>
          <h1 className="app-title">Piano Tracker</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
