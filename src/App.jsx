import { useState, useMemo, useEffect } from "react";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { extractVideoId } from "./utils/youtube";
import Header from "./components/Header/Header";
import StatsBar from "./components/StatsBar/StatsBar";
import FilterTabs from "./components/FilterTabs/FilterTabs";
import PieceCard from "./components/PieceCard/PieceCard";
import EmptyState from "./components/EmptyState/EmptyState";
import AddEditModal from "./components/Modal/AddEditModal";
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
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [editingPiece, setEditingPiece] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [practicingPieceId, setPracticingPieceId] = useState(null);
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = (message) => {
    setToast({ message, isVisible: true });
  };

  const hideToast = () => {
    setToast({ message: "", isVisible: false });
  };

  // Prüft ob YouTube URL bereits existiert (basierend auf Video-ID)
  const isDuplicateYouTubeUrl = (url, excludeId = null) => {
    const newVideoId = extractVideoId(url);
    if (!newVideoId) return false;

    return pieces.some((piece) => {
      // Überspringe das aktuell zu editierende Piece
      if (excludeId && piece.id === excludeId) return false;

      const existingVideoId = extractVideoId(piece.youtubeUrl);
      return existingVideoId === newVideoId;
    });
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

    if (searchQuery) {
      result = result.filter((piece) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          piece.title.toLowerCase().includes(searchLower) ||
          piece.artist.toLowerCase().includes(searchLower)
        );
      });
    }

    if (filters.difficulty !== "all") {
      result = result.filter((p) => p.difficulty === filters.difficulty);
    }
    if (filters.progress !== "all") {
      result = result.filter((p) => p.progress === filters.progress);
    }

    if (sort.sortBy === "random") {
      result = result.sort(() => Math.random() - 0.5);
    } else if (sort.sortBy === "lastPracticed") {
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
    } else if (sort.sortBy === "trending") {
      // NEU: Trending basierend auf Sessions der letzten 7 Tage
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      result = result.sort((a, b) => {
        // Zähle Practice-Sessions in den letzten 7 Tagen
        const aWeeklyPractices = (a.practiceLog || []).filter(
          (log) => new Date(log.timestamp) >= oneWeekAgo
        );
        const bWeeklyPractices = (b.practiceLog || []).filter(
          (log) => new Date(log.timestamp) >= oneWeekAgo
        );

        // Berechne Trending-Score: Anzahl Sessions × Gesamtzeit
        const aScore =
          aWeeklyPractices.length *
          aWeeklyPractices.reduce((sum, log) => sum + log.duration, 0);
        const bScore =
          bWeeklyPractices.length *
          bWeeklyPractices.reduce((sum, log) => sum + log.duration, 0);

        return bScore - aScore;
      });
    } else if (sort.sortBy === "default") {
      // NEU: Default = nach createdAt sortieren
      result = result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA; // Neueste zuerst
      });
    }

    // NEU: Reverse auch für "default" erlauben
    if (sort.reverse && sort.sortBy !== "random") {
      result = result.reverse();
    }

    return result;
  }, [pieces, searchQuery, filters, sort]);

  const handleSavePiece = (pieceData) => {
    // Duplikat-Prüfung
    const isDuplicate = isDuplicateYouTubeUrl(
      pieceData.youtubeUrl,
      editingPiece?.id
    );

    if (isDuplicate) {
      showToast("⚠️ This YouTube video already exists!");
      return;
    }

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
        lastPracticed: null,
        practiceLog: [], // NEU: Leeres Practice-Log
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

  const handleOpenYouTube = (url, pieceId) => {
    setYoutubeUrl(url);
    setPracticingPieceId(pieceId);
    setIsYouTubeModalOpen(true);
  };

  const handleSavePracticeTime = (pieceId, seconds, timestamp) => {
    if (pieceId && seconds > 0) {
      setPieces((prevPieces) =>
        prevPieces.map((p) =>
          p.id === pieceId
            ? {
                ...p,
                lastPracticed: timestamp,
                practiceLog: [
                  ...(p.practiceLog || []),
                  { timestamp, duration: seconds },
                ],
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
      <div className="scroll-container">
        <Header onAddClick={() => setIsAddModalOpen(true)} />
        <StatsBar pieces={pieces} />
        <div className="container">
          <FilterTabs
            onSearchChange={setSearchQuery}
            onFilterChange={setFilters}
            onSortChange={setSort}
          />
        </div>

        <div className="container">
          {processedPieces.length === 0 ? (
            <EmptyState onAddClick={() => setIsAddModalOpen(true)} />
          ) : (
            <div className="pieces-grid">
              {processedPieces.map((piece) => (
                <PieceCard
                  key={piece.id}
                  piece={piece}
                  onEdit={handleEditPiece}
                  onYouTubeClick={handleOpenYouTube}
                />
              ))}
            </div>
          )}
        </div>
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
