import { useMemo, useState } from "react";
import "./StatsView.css";
import { formatTime } from "../../utils/youtube";
import PracticeCalendar from "../PracticeCalendar/PracticeCalendar";
import PracticeHistory from "../PracticeHistory/PracticeHistory";
import Header from "../Header/Header";

function StatsView({ pieces, practiceSessions, onDeleteSession }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Statistiken berechnen
  const stats = useMemo(() => {
    const safePieces = pieces || [];
    const safeSessions = practiceSessions || {};

    const mastered = safePieces.filter((p) => p.milestones?.length >= 7).length;

    let totalTime = 0;
    let totalSessions = 0;

    Object.values(safeSessions).forEach((sessions) => {
      if (!Array.isArray(sessions)) return;
      totalSessions += sessions.length;
      sessions.forEach((session) => {
        totalTime += session?.duration || 0;
      });
    });

    const avgSessionLength =
      totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;

    // Heute
    const today = new Date().toDateString();
    let todayTime = 0;
    Object.values(safeSessions).forEach((sessions) => {
      if (!Array.isArray(sessions)) return;
      sessions.forEach((session) => {
        if (
          session?.timestamp &&
          new Date(session.timestamp).toDateString() === today
        ) {
          todayTime += session?.duration || 0;
        }
      });
    });

    // Diese Woche
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    let weekTime = 0;
    Object.values(safeSessions).forEach((sessions) => {
      if (!Array.isArray(sessions)) return;
      sessions.forEach((session) => {
        if (session?.timestamp && new Date(session.timestamp) >= weekAgo) {
          weekTime += session?.duration || 0;
        }
      });
    });

    return {
      mastered,
      totalTime,
      totalSessions,
      avgSessionLength,
      todayTime,
      weekTime,
    };
  }, [pieces, practiceSessions]);

  return (
    <>
      <Header />
      <div className="stats-view">
        <h1 className="stats-header">📊 Statistics</h1>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card-large">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-value-large">
                {formatTime(stats.totalTime)}
              </div>
              <div className="stat-label-large">Total Practice Time</div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value-large">{stats.totalSessions}</div>
              <div className="stat-label-large">Total Sessions</div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon">✨</div>
            <div className="stat-content">
              <div className="stat-value-large">{stats.mastered}</div>
              <div className="stat-label-large">Mastered Pieces</div>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value-large">
                {formatTime(stats.avgSessionLength)}
              </div>
              <div className="stat-label-large">Avg Session</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="recent-stats">
            <div className="recent-item">
              <span className="recent-label">Today:</span>
              <span className="recent-value">
                {formatTime(stats.todayTime)}
              </span>
            </div>
            <div className="recent-item">
              <span className="recent-label">This Week:</span>
              <span className="recent-value">{formatTime(stats.weekTime)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="stats-actions">
          <button
            className="stats-action-btn calendar-btn"
            onClick={() => setIsCalendarOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 2v4M8 2v4M3 10h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Practice Calendar
          </button>

          <button
            className="stats-action-btn history-btn"
            onClick={() => setIsHistoryOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3v18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 17V9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 17v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 17v-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Session History
          </button>
        </div>

        {/* Modals */}
        <PracticeCalendar
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          practiceSessions={practiceSessions}
        />

        <PracticeHistory
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          pieces={pieces}
          practiceSessions={practiceSessions}
          onDeleteSession={onDeleteSession}
        />

        {/* Bottom spacer for navigation bar */}
        <div className="bottom-spacer"></div>
      </div>
    </>
  );
}

export default StatsView;
