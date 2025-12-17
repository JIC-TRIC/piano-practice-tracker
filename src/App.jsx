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
import Settings from "./components/Settings/Settings";
import PracticeHistory from "./components/PracticeHistory/PracticeHistory";

function getSessionWeight(daysAgo) {
  // Exponentieller Abfall: Jeder Tag macht einen Unterschied
  // Nach 30 Tagen noch 1/10 des heutigen Werts
  // Formel: 10 * e^(-daysAgo/13) erreicht genau 1.0 nach 30 Tagen
  return 10 * Math.exp(-daysAgo / 13);
}

function App() {
  const [pieces, setPieces] = useLocalStorage("pianoPieces", []);
  const [practiceSessions, setPracticeSessions] = useLocalStorage(
    "practiceSessions",
    {}
  );
  const [settings, setSettings] = useLocalStorage("pianoSettings", {
    showExternalYouTubeButton: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    difficulty: [],
    progress: [],
  });
  const [sort, setSort] = useState({ sortBy: "trending", reverse: false });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingPiece, setEditingPiece] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [practicingPiece, setPracticingPiece] = useState(null);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll-to-Top Button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (message) => {
    setToast({ message, isVisible: true });
  };

  const hideToast = () => {
    setToast({ message: "", isVisible: false });
  };

  const isDuplicateYouTubeUrl = (url, excludeId = null) => {
    const newVideoId = extractVideoId(url);
    if (!newVideoId) return false;

    return pieces.some((piece) => {
      if (excludeId && piece.id === excludeId) return false;
      const existingVideoId = extractVideoId(piece.youtubeUrl);
      return existingVideoId === newVideoId;
    });
  };

  const getStatusFromMilestones = (milestones = []) => {
    const count = milestones.length;
    if (count === 0) return "not_started";
    if (count <= 2) return "learning";
    if (count <= 4) return "practicing";
    if (count <= 6) return "polishing";
    return "mastered";
  };

  const getStatusValue = (status) => {
    const values = {
      not_started: 0,
      learning: 1,
      practicing: 2,
      polishing: 3,
      mastered: 4,
    };
    return values[status] || 0;
  };

  const getDifficultyValue = (difficulty) => {
    const values = {
      Unknown: -1,
      Free: 0,
      Easy: 1,
      Medium: 2,
      Hard: 3,
      Ultrahard: 4,
    };
    return values[difficulty] || 0;
  };

  const trendingScore = (piece, now) => {
    const logs = practiceSessions[piece.id] || [];

    let score = 0;
    for (let log of logs) {
      const logDate = new Date(log.timestamp);
      const daysAgo = Math.floor((now - logDate) / (1000 * 60 * 60 * 24));

      const weight = getSessionWeight(daysAgo);
      score += log.duration * weight;
    }
    return score;
  };

  const getTotalPracticeTime = (pieceId) => {
    const logs = practiceSessions[pieceId] || [];
    return logs.reduce((sum, log) => sum + log.duration, 0);
  };

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

    if (filters.difficulty && filters.difficulty.length > 0) {
      result = result.filter((p) => filters.difficulty.includes(p.difficulty));
    }
    if (filters.progress && filters.progress.length > 0) {
      result = result.filter((p) => {
        const status = getStatusFromMilestones(p.milestones);
        return filters.progress.includes(status);
      });
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
      result = result.sort((a, b) => {
        const statusA = getStatusFromMilestones(a.milestones);
        const statusB = getStatusFromMilestones(b.milestones);
        return getStatusValue(statusA) - getStatusValue(statusB);
      });
    } else if (sort.sortBy === "difficulty") {
      result = result.sort(
        (a, b) =>
          getDifficultyValue(a.difficulty) - getDifficultyValue(b.difficulty)
      );
    } else if (sort.sortBy === "title") {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort.sortBy === "practiceTime") {
      result = result.sort(
        (a, b) => getTotalPracticeTime(b.id) - getTotalPracticeTime(a.id)
      );
    } else if (sort.sortBy === "trending") {
      // NEU: Trending-Algorithmus mit Gewichtung über 3 Monate
      const now = new Date();
      result = result.sort(
        (a, b) => trendingScore(b, now) - trendingScore(a, now)
      );
    } else if (sort.sortBy === "default") {
      result = result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
    }

    if (sort.reverse && sort.sortBy !== "random") {
      result = result.reverse();
    }

    return result;
  }, [pieces, searchQuery, filters, sort, practiceSessions]);

  const handleSavePiece = (pieceData) => {
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
    const piece = pieces.find((p) => p.id === pieceId);
    setYoutubeUrl(url);
    setPracticingPiece(piece);
    setIsYouTubeModalOpen(true);
  };

  const handleSavePracticeTime = (pieceId, seconds, timestamp) => {
    if (pieceId && seconds >= 30) {
      setPracticeSessions((prev) => {
        const pieceLogs = prev[pieceId] || [];
        const updated = [...pieceLogs, { timestamp, duration: seconds }];
        return { ...prev, [pieceId]: updated };
      });

      // Nur noch das letzte Übungsdatum im Piece speichern!
      setPieces((prev) =>
        prev.map((p) =>
          p.id === pieceId ? { ...p, lastPracticed: timestamp } : p
        )
      );
      showToast("Practice time saved!");
    } else if (pieceId && seconds > 0) {
      // Update last practiced even for short sessions
      setPieces((prev) =>
        prev.map((p) =>
          p.id === pieceId ? { ...p, lastPracticed: timestamp } : p
        )
      );
    }
  };

  const handleUpdateProgress = (pieceId, newMilestones) => {
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, milestones: newMilestones } : p
      )
    );
    showToast("Progress updated!");
  };

  const handleDeleteSession = (pieceId, timestamp) => {
    setPracticeSessions((prev) => {
      const pieceLogs = prev[pieceId] || [];
      const updated = pieceLogs.filter((session) => session.timestamp !== timestamp);
      return { ...prev, [pieceId]: updated };
    });
    showToast("Session deleted!");
  };

  const handleCloseYouTube = () => {
    setIsYouTubeModalOpen(false);
    setYoutubeUrl("");
    setPracticingPiece(null);
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    showToast("Settings saved!");
  };

  return (
    <div className="App">
      <div className="scroll-container">
        <Header
          onAddClick={() => setIsAddModalOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
        <StatsBar pieces={pieces} practiceSessions={practiceSessions} />
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
                  sessions={practiceSessions[piece.id] || []}
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
        piece={practicingPiece}
        onSavePracticeTime={handleSavePracticeTime}
        onUpdateProgress={handleUpdateProgress}
        settings={settings}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onViewHistory={() => {
          setIsSettingsOpen(false);
          setIsHistoryOpen(true);
        }}
      />

      <PracticeHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        pieces={pieces}
        practiceSessions={practiceSessions}
        onDeleteSession={handleDeleteSession}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onHide={hideToast}
      />

      <button
        className={`scroll-to-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 19V5M5 12l7-7 7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default App;
