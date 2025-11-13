import { useState, useEffect, useRef } from "react";
import "./Modal.css";
import { formatTimerDisplay } from "../../utils/youtube";

function TimerModal({ isOpen, onClose, onSave }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      setIsRunning(false);
    }
  }, [isOpen]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleSave = () => {
    onSave(seconds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Übungszeit</h2>
        </div>
        <div className="timer-display">{formatTimerDisplay(seconds)}</div>
        <div className="timer-controls">
          {!isRunning ? (
            <button className="timer-btn" onClick={handleStart}>
              Start
            </button>
          ) : (
            <button className="timer-btn active" onClick={handlePause}>
              Pause
            </button>
          )}
          <button className="timer-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
        <div className="form-actions" style={{ marginTop: "2rem" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Zeit speichern
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerModal;
