import { useMemo } from "react";
import "./PracticeCalendar.css";

function PracticeCalendar({ isOpen, onClose, practiceSessions }) {
  const calendarData = useMemo(() => {
    // Sammle alle Übungstage mit Gesamtzeit
    const dayMap = {};

    Object.values(practiceSessions)
      .flat()
      .forEach((session) => {
        const date = new Date(session.timestamp);
        const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

        if (!dayMap[dateKey]) {
          dayMap[dateKey] = 0;
        }
        dayMap[dateKey] += session.duration;
      });

    // Generiere die letzten 365 Tage
    const days = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      days.push({
        date: dateKey,
        dayOfWeek: date.getDay(), // 0 = Sunday, 6 = Saturday
        seconds: dayMap[dateKey] || 0,
        month: date.getMonth(),
        day: date.getDate(),
      });
    }

    return days;
  }, [practiceSessions]);

  // Berechne Intensitätslevel basierend auf Übungszeit
  const getIntensity = (seconds) => {
    if (seconds === 0) return 0;
    if (seconds < 600) return 1; // < 10 min
    if (seconds < 1800) return 2; // < 30 min
    if (seconds < 3600) return 3; // < 1h
    return 4; // >= 1h
  };

  // Gruppiere Tage in Wochen (für Grid-Layout)
  const weeks = useMemo(() => {
    const weeksArray = [];
    let currentWeek = [];

    // Fülle erste Woche mit leeren Tagen vor dem ersten Tag
    const firstDay = calendarData[0];
    if (firstDay) {
      for (let i = 0; i < firstDay.dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }

    calendarData.forEach((day) => {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });

    // Fülle letzte Woche mit leeren Tagen auf
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArray.push(currentWeek);
    }

    return weeksArray;
  }, [calendarData]);

  // Finde Monate für Labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDayInWeek = week.find((day) => day !== null);
      if (firstDayInWeek && firstDayInWeek.month !== lastMonth) {
        if (firstDayInWeek.day <= 7) {
          // Nur wenn es der Anfang des Monats ist
          labels.push({
            weekIndex,
            month: firstDayInWeek.month,
          });
          lastMonth = firstDayInWeek.month;
        }
      }
    });

    return labels;
  }, [weeks]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content calendar-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">📅 Practice Calendar</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="calendar-container">
          <div className="calendar-header">
            <div className="month-labels">
              {monthLabels.map((label, idx) => (
                <span
                  key={idx}
                  className="month-label"
                  style={{ gridColumn: label.weekIndex + 2 }}
                >
                  {monthNames[label.month]}
                </span>
              ))}
            </div>
          </div>

          <div className="calendar-grid">
            {/* Day labels */}
            <div className="day-labels">
              {dayNames.map((day, idx) => (
                <div key={idx} className="day-label">
                  {day.substring(0, 1)}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="heatmap-grid">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="week-column">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`day-cell ${
                        day ? `intensity-${getIntensity(day.seconds)}` : "empty"
                      }`}
                      title={
                        day ? `${day.date}: ${formatTime(day.seconds)}` : ""
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="calendar-legend">
            <span className="legend-label">Less</span>
            <div className="day-cell intensity-0" />
            <div className="day-cell intensity-1" />
            <div className="day-cell intensity-2" />
            <div className="day-cell intensity-3" />
            <div className="day-cell intensity-4" />
            <span className="legend-label">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeCalendar;
