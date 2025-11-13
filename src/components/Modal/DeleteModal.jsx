import "./Modal.css";

function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Stück löschen?</h2>
        </div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Möchtest du dieses Stück wirklich löschen? Diese Aktion kann nicht
          rückgängig gemacht werden.
        </p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
