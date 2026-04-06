import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Header from "./components/Header";
import TimeSelection from "./components/TimeSelection";
import Recommendation from "./components/Recommendation";
import BulkAddView from "./components/BulkAddView";
import VaultView from "./components/VaultView";

const API_BASE = "https://donext1.onrender.com/api/tasks";

function App() {
  const [userKey, setUserKey] = useState(() => localStorage.getItem("FLUX_KEY"));
  const [entryKey, setEntryKey] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTime, setSelectedTime] = useState(30);
  const [activeTask, setActiveTask] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();

  const fetchTasks = useCallback(async () => {
    if (!userKey) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-flux-key": userKey,
        },
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("fetchTasks failed:", err);
      setError("Could not reach server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [userKey]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogin = (e) => {
    e.preventDefault();
    const key = entryKey.trim();
    if (!key) return;
    localStorage.setItem("FLUX_KEY", key);
    setUserKey(key);
  };

  const handleLogout = () => {
    if (window.confirm("TERMINATE_SESSION?")) {
      localStorage.removeItem("FLUX_KEY");
      setUserKey(null);
      setTasks([]);
    }
  };

  const { fits, epics } = useMemo(() => {
    const priorityScore = { high: 3, medium: 2, low: 1 };
    const sorted = [...tasks].sort((a, b) => {
      const diff = (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      return diff !== 0 ? diff : b.duration - a.duration;
    });
    return {
      fits: sorted.filter((t) => t.duration <= selectedTime || t.isChippable),
      epics: sorted.filter((t) => t.duration > selectedTime && !t.isChippable),
    };
  }, [tasks, selectedTime]);

  const handleStart = (task) => {
    setActiveTask(task);
    setStartTime(Date.now());
  };

  const handleFinish = async () => {
    const elapsed = Math.floor((Date.now() - startTime) / 60000);
    const newDuration = activeTask.duration - elapsed;
    try {
      await fetch(`${API_BASE}/${activeTask._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-flux-key": userKey,
        },
        body: JSON.stringify({ duration: newDuration }),
      });
    } catch (err) {
      console.error("handleFinish failed:", err);
    }
    setActiveTask(null);
    setStartTime(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("DISCARD_OBJECTIVE?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { "x-flux-key": userKey },
      });
      fetchTasks();
    } catch (err) {
      console.error("handleDelete failed:", err);
    }
  };

  // --- AUTH WALL ---
  if (!userKey) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white uppercase tracking-tight">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif italic lowercase">
              Flux<span className="text-[#6b6a67] not-italic">_</span>
            </h1>
            <p className="font-mono text-[9px] text-[#6b6a67] tracking-[0.3em]">IDENTITY_CHALLENGE</p>
          </div>
          <div className="space-y-6">
            <input
              type="password"
              autoFocus
              placeholder="ENTER_PRIVATE_KEY"
              className="w-full bg-transparent border-b border-[#2e2d2b] py-4 font-mono text-sm outline-none focus:border-white transition-colors"
              value={entryKey}
              onChange={(e) => setEntryKey(e.target.value)}
            />
            <div className="space-y-3 p-4 border border-[#2e2d2b] bg-[#111110]">
              <p className="font-mono text-[8px] leading-relaxed text-[#6b6a67] tracking-wider">
                <span className="text-white">NOTICE //</span> YOUR KEY IS A PRIVATE ANCHOR.
                FLUX DOES NOT STORE PASSWORDS. IF LOST, DATA RECOVERY IS IMPOSSIBLE.
                <br /><br />
                NEW USER? ANY STRING WORKS. EXAMPLE: <span className="text-white">"MY_SECRET_KEY_123"</span>
              </p>
            </div>
          </div>
          <button className="w-full bg-white text-black py-5 font-bold text-[11px] tracking-[0.3em] hover:bg-[#fafafa] transition-all">
            PROCEED
          </button>
        </form>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] px-6 py-12 md:py-24 font-sans uppercase tracking-tight">
      <div className="max-w-[480px] mx-auto space-y-16">
        <Header />

        {!activeTask && (
          <nav className="flex gap-12 border-b border-[#2e2d2b]">
            <Link to="/" className={`pb-2 text-[10px] font-bold tracking-[0.2em] relative transition-colors ${location.pathname === "/" ? "text-white" : "text-[#6b6a67]"}`}>
              Focus {location.pathname === "/" && <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />}
            </Link>
            <Link to="/add" className={`pb-2 text-[10px] font-bold tracking-[0.2em] relative transition-colors ${location.pathname === "/add" ? "text-white" : "text-[#6b6a67]"}`}>
              Compile {location.pathname === "/add" && <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />}
            </Link>
            <Link to="/vault" className={`pb-2 text-[10px] font-bold tracking-[0.2em] relative transition-colors ${location.pathname === "/vault" ? "text-white" : "text-[#6b6a67]"}`}>
              Vault {location.pathname === "/vault" && <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />}
            </Link>
          </nav>
        )}

        {error && (
          <div className="border border-red-800 bg-[#1a0a0a] p-4 font-mono text-[9px] text-red-400 tracking-wider">
            {error}
            <button onClick={fetchTasks} className="ml-4 underline hover:text-red-200">RETRY</button>
          </div>
        )}

        <main className="animate-in fade-in duration-500">
          <Routes>
            <Route
              path="/"
              element={
                activeTask ? (
                  <div className="text-center space-y-16 py-24 animate-in zoom-in duration-1000">
                    <div className="space-y-4">
                      <p className="font-mono text-[10px] text-[#6b6a67] tracking-[0.4em]">NOW_WORKING_ON</p>
                      <h2 className="text-5xl font-serif italic text-white lowercase">{activeTask.title}</h2>
                    </div>
                    <button onClick={handleFinish} className="border border-white px-12 py-4 font-mono text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                      I'M DONE FOR NOW
                    </button>
                  </div>
                ) : loading ? (
                  <p className="font-mono text-[10px] text-[#6b6a67] tracking-[0.3em] text-center py-12">LOADING...</p>
                ) : (
                  <div className="space-y-16">
                    <TimeSelection selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                    <Recommendation fits={fits} epics={epics} onStart={handleStart} onDelete={handleDelete} />
                  </div>
                )
              }
            />
            <Route path="/add" element={<BulkAddView onInject={fetchTasks} userKey={userKey} apiBase={API_BASE} />} />
            <Route path="/vault" element={<VaultView tasks={tasks} onDelete={handleDelete} />} />
          </Routes>
        </main>

        <footer className="pt-12 border-t border-[#2e2d2b] text-[9px] font-mono text-[#2e2d2b] flex justify-between items-center">
          <button onClick={handleLogout} className="hover:text-white transition-colors">TERMINATE_SESSION</button>
          <span className="tracking-[0.2em]">©2026_FLUX_UNIT</span>
        </footer>
      </div>
    </div>
  );
}

export default App;