import { useMemo, useEffect } from "react";
import "./PracticeCalendar.css";

function PracticeCalendar({ isOpen, onClose, practiceSessions }) {
  // Verhindere Body-Scroll wenn Modal geöffnet ist
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  const monthsData = useMemo(() => {
    // Sammle alle Übungstage mit Gesamtzeit
    const dayMap = {};
    let firstSessionDate = null;

    Object.values(practiceSessions)
      .flat()
      .forEach((session) => {
        const date = new Date(session.timestamp);
        // Normalisiere auf lokales Datum (Mitternacht) um Zeitzone-Probleme zu vermeiden
        const localDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const dateKey = `${localDate.getFullYear()}-${String(
          localDate.getMonth() + 1
        ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

        if (!dayMap[dateKey]) {
          dayMap[dateKey] = 0;
        }
        dayMap[dateKey] += session.duration;

        // Finde früheste Session
        if (!firstSessionDate || localDate < firstSessionDate) {
          firstSessionDate = localDate;
        }
      });

    // Wenn keine Sessions vorhanden, verwende heute als Start
    if (!firstSessionDate) {
      firstSessionDate = new Date();
    }

    // Generiere Monate von der ersten Session bis heute
    const months = [];
    const today = new Date();
    const startDate = new Date(
      firstSessionDate.getFullYear(),
      firstSessionDate.getMonth(),
      1
    );
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Letzter Tag des aktuellen Monats

    let currentMonth = new Date(startDate);

    while (currentMonth <= endDate) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const monthName = currentMonth.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      // Generiere alle Tage des Monats
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

      const days = [];

      // Füge leere Tage am Anfang hinzu
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }

      // Füge alle Tage des Monats hinzu
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;

        days.push({
          date: dateKey,
          day: day,
          seconds: dayMap[dateKey] || 0,
        });
      }

      months.push({
        name: monthName,
        year: year,
        month: month,
        days: days,
      });

      // Nächster Monat
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    return months.reverse(); // Neueste Monate zuerst
  }, [practiceSessions]);

  // Berechne Intensitätslevel basierend auf Übungszeit
  const getIntensity = (seconds) => {
    if (seconds === 0) return 0;
    if (seconds < 600) return 1; // < 10 min
    if (seconds < 1800) return 2; // < 30 min
    if (seconds < 3600) return 3; // < 1h
    return 4; // >= 1h
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

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
          {monthsData.length === 0 ? (
            <div className="empty-calendar">
              <p>
                No practice sessions yet. Start practicing to see your calendar!
              </p>
            </div>
          ) : (
            monthsData.map((monthData, monthIdx) => (
              <div key={monthIdx} className="month-block">
                <div className="month-header">
                  <h3 className="month-title">{monthData.name}</h3>
                </div>

                <div className="month-calendar">
                  <div className="weekday-labels">
                    {dayNames.map((day, idx) => (
                      <div key={idx} className="weekday-label">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="days-grid">
                    {monthData.days.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className={`day-cell ${
                          day
                            ? `intensity-${getIntensity(day.seconds)}`
                            : "empty"
                        }`}
                        title={
                          day ? `${day.date}: ${formatTime(day.seconds)}` : ""
                        }
                      >
                        {day && <span className="day-number">{day.day}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}

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
