import { useState } from "react";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Header from "./components/Header/Header";
import StatsBar from "./components/StatsBar/StatsBar";
import FilterTabs from "./components/FilterTabs/FilterTabs";
import PieceCard from "./components/PieceCard/PieceCard";
import EmptyState from "./components/EmptyState/EmptyState";
import AddEditModal from "./components/Modal/AddEditModal";
import TimerModal from "./components/Modal/TimerModal";
import DeleteModal from "./components/Modal/DeleteModal";
import YouTubeModal from "./components/Modal/YoutubeModal";
import Toast from "./components/Toast/Toast";

function App() {
  const [pieces, setPieces] = useLocalStorage("pianoPieces", []);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [editingPiece, setEditingPiece] = useState(null);
  const [deletingPieceId, setDeletingPieceId] = useState(null);
  const [timerPieceId, setTimerPieceId] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = (message) => {
    setToast({ message, isVisible: true });
  };

  const hideToast = () => {
    setToast({ message: "", isVisible: false });
  };

  const getFilteredPieces = () => {
    if (currentFilter === "learning") {
      return pieces.filter((p) => p.progress < 100);
    } else if (currentFilter === "mastered") {
      return pieces.filter((p) => p.progress === 100);
    } else if (
      ["Free", "Easy", "Medium", "Hard", "Ultrahard"].includes(currentFilter)
    ) {
      return pieces.filter((p) => p.difficulty === currentFilter);
    }
    return pieces;
  };

  const handleSavePiece = (pieceData) => {
    if (editingPiece) {
      setPieces(
        pieces.map((p) =>
          p.id === editingPiece.id ? { ...p, ...pieceData } : p
        )
      );
      showToast("Stück aktualisiert!");
    } else {
      const newPiece = {
        id: Date.now().toString(),
        ...pieceData,
        practiceTime: 0,
        createdAt: new Date().toISOString(),
      };
      setPieces([...pieces, newPiece]);
      showToast("Stück hinzugefügt!");
    }
    setIsAddModalOpen(false);
    setEditingPiece(null);
  };

  const handleEditPiece = (id) => {
    const piece = pieces.find((p) => p.id === id);
    setEditingPiece(piece);
    setIsAddModalOpen(true);
  };

  const handleDeletePiece = (id) => {
    setDeletingPieceId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setPieces(pieces.filter((p) => p.id !== deletingPieceId));
    showToast("Stück gelöscht");
    setIsDeleteModalOpen(false);
    setDeletingPieceId(null);
  };

  const handleOpenTimer = (id) => {
    setTimerPieceId(id);
    setIsTimerModalOpen(true);
  };

  const handleSaveTimer = (seconds) => {
    if (timerPieceId && seconds > 0) {
      setPieces(
        pieces.map((p) =>
          p.id === timerPieceId
            ? { ...p, practiceTime: (p.practiceTime || 0) + seconds }
            : p
        )
      );
      showToast(`Übungszeit gespeichert!`);
    }
    setIsTimerModalOpen(false);
    setTimerPieceId(null);
  };

  const handleOpenYouTube = (url) => {
    setYoutubeUrl(url);
    setIsYouTubeModalOpen(true);
  };

  const filteredPieces = getFilteredPieces();

  return (
    <div className="App">
      <Header onAddClick={() => setIsAddModalOpen(true)} />
      <StatsBar pieces={pieces} />

      <div className="container">
        <FilterTabs
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />

        {filteredPieces.length === 0 ? (
          <EmptyState onAddClick={() => setIsAddModalOpen(true)} />
        ) : (
          <div className="pieces-grid">
            {filteredPieces.map((piece) => (
              <PieceCard
                key={piece.id}
                piece={piece}
                onEdit={handleEditPiece}
                onDelete={handleDeletePiece}
                onTimer={handleOpenTimer}
                onYouTubeClick={handleOpenYouTube}
              />
            ))}
          </div>
        )}
      </div>

      <AddEditModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPiece(null);
        }}
        onSave={handleSavePiece}
        editingPiece={editingPiece}
      />

      <TimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        onSave={handleSaveTimer}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        videoUrl={youtubeUrl}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onHide={hideToast}
      />
    </div>
  );
}

export default App;
