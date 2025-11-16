import { useState, useMemo } from "react";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Header from "./components/Header/Header";
import StatsBar from "./components/StatsBar/StatsBar";
import FilterTabs from "./components/FilterTabs/FilterTabs";
import PieceCard from "./components/PieceCard/PieceCard";
import EmptyState from "./components/EmptyState/EmptyState";
import AddEditModal from "./components/Modal/AddEditModal";
import DeleteModal from "./components/Modal/DeleteModal";
import YouTubeModal from "./components/Modal/YouTubeModal";
import Toast from "./components/Toast/Toast";

function App() {
  const [pieces, setPieces] = useLocalStorage("pianoPieces", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    difficulty: "all",
    progress: "all",
  });
  const [sort, setSort] = useState({ sortBy: "default", reverse: false });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [editingPiece, setEditingPiece] = useState(null);
  const [deletingPieceId, setDeletingPieceId] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [practicingPieceId, setPracticingPieceId] = useState(null);
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = (message) => {
    setToast({ message, isVisible: true });
  };

  const hideToast = () => {
    setToast({ message: "", isVisible: false });
  };

  // Hilfsfunktion für Fortschritt-Prozent
  const getProgressValue = (progress) => {
    const values = {
      not_started: 0,
      hands_separate: 1,
      hands_together: 2,
      perfected: 3,
      memorized: 4,
    };
    return values[progress] || 0;
  };

  // Hilfsfunktion für Schwierigkeit-Wert
  const getDifficultyValue = (difficulty) => {
    const values = {
      Free: 0,
      Easy: 1,
      Medium: 2,
      Hard: 3,
      Ultrahard: 4,
    };
    return values[difficulty] || 0;
  };

  // Filter, Sort und Search kombiniert
  const processedPieces = useMemo(() => {
    let result = [...pieces];

    // 1. Suche anwenden
    if (searchQuery) {
      result = result.filter((piece) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          piece.title.toLowerCase().includes(searchLower) ||
          piece.artist.toLowerCase().includes(searchLower)
        );
      });
    }

    // 2. Filter anwenden
    if (filters.difficulty !== "all") {
      result = result.filter((p) => p.difficulty === filters.difficulty);
    }
    if (filters.progress !== "all") {
      result = result.filter((p) => p.progress === filters.progress);
    }

    // 3. Sortierung anwenden
    if (sort.sortBy === "random") {
      result = result.sort(() => Math.random() - 0.5);
    } else if (sort.sortBy === "lastPracticed") {
      // Sortiere nach letztem Übungszeitpunkt (neueste zuerst)
      result = result.sort((a, b) => {
        const dateA = a.lastPracticed ? new Date(a.lastPracticed) : new Date(0);
        const dateB = b.lastPracticed ? new Date(b.lastPracticed) : new Date(0);
        return dateB - dateA;
      });
    } else if (sort.sortBy === "progress") {
      result = result.sort(
        (a, b) => getProgressValue(a.progress) - getProgressValue(b.progress)
      );
    } else if (sort.sortBy === "difficulty") {
      result = result.sort(
        (a, b) =>
          getDifficultyValue(a.difficulty) - getDifficultyValue(b.difficulty)
      );
    } else if (sort.sortBy === "title") {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort.sortBy === "practiceTime") {
      result = result.sort(
        (a, b) => (b.practiceTime || 0) - (a.practiceTime || 0)
      );
    }

    // 4. Umkehrung anwenden
    if (sort.reverse && sort.sortBy !== "default") {
      result = result.reverse();
    }

    return result;
  }, [pieces, searchQuery, filters, sort]);

  const handleSavePiece = (pieceData) => {
    if (editingPiece) {
      setPieces(
        pieces.map((p) =>
          p.id === editingPiece.id ? { ...p, ...pieceData } : p
        )
      );
      showToast("Piece updated!");
    } else {
      const newPiece = {
        id: Date.now().toString(),
        ...pieceData,
        practiceTime: 0,
        lastPracticed: null, // Initial null
        createdAt: new Date().toISOString(),
      };
      setPieces([...pieces, newPiece]);
      showToast("Piece added!");
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
    showToast("Piece deleted");
    setIsDeleteModalOpen(false);
    setDeletingPieceId(null);
  };

  const handleOpenYouTube = (url, pieceId) => {
    setYoutubeUrl(url);
    setPracticingPieceId(pieceId);
    setIsYouTubeModalOpen(true);
  };

  const handleSavePracticeTime = (pieceId, seconds, timestamp) => {
    if (pieceId && seconds > 0) {
      setPieces(
        pieces.map((p) =>
          p.id === pieceId
            ? {
                ...p,
                practiceTime: (p.practiceTime || 0) + seconds,
                lastPracticed: timestamp, // Speichere Zeitpunkt
              }
            : p
        )
      );
      showToast(`Practice time saved!`);
    }
  };

  const handleCloseYouTube = () => {
    setIsYouTubeModalOpen(false);
    setYoutubeUrl("");
    setPracticingPieceId(null);
  };

  return (
    <div className="App">
      <Header onAddClick={() => setIsAddModalOpen(true)} />
      <StatsBar pieces={pieces} />

      <div className="container">
        <FilterTabs
          onSearchChange={setSearchQuery}
          onFilterChange={setFilters}
          onSortChange={setSort}
        />

        {processedPieces.length === 0 ? (
          <EmptyState onAddClick={() => setIsAddModalOpen(true)} />
        ) : (
          <div className="pieces-grid">
            {processedPieces.map((piece) => (
              <PieceCard
                key={piece.id}
                piece={piece}
                onEdit={handleEditPiece}
                onDelete={handleDeletePiece}
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={handleCloseYouTube}
        videoUrl={youtubeUrl}
        pieceId={practicingPieceId}
        onSavePracticeTime={handleSavePracticeTime}
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
