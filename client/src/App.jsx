import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header";
import TimeSelection from "./components/TimeSelection";
import Recommendation from "./components/Recommendation";
import BulkAddView from "./components/BulkAddView";
import VaultView from "./components/VaultView";

const API_BASE = "https://donext1.onrender.com/api/tasks";

// --- ELECTRIC GRADIENTS & TACTILE RINGS ---
export const getPlayfulTheme = (priority, index = 0) => {
  const themes = {
    lime: "bg-gradient-to-br from-[#E2FF31] to-[#ADDB00] text-black ring-1 ring-inset ring-white/40",
    purple: "bg-gradient-to-br from-[#D8B4FE] to-[#A874FA] text-black ring-1 ring-inset ring-white/40",
    peach: "bg-gradient-to-br from-[#FFC29F] to-[#FF8B3D] text-black ring-1 ring-inset ring-white/40",
    sky: "bg-gradient-to-br from-[#8DE4FF] to-[#25BAFA] text-black ring-1 ring-inset ring-white/40",
    pink: "bg-gradient-to-br from-[#FFADF0] to-[#F552D4] text-black ring-1 ring-inset ring-white/40",
  };

  if (priority === "high") return themes.lime;
  if (priority === "medium") return index % 2 === 0 ? themes.purple : themes.peach;
  return index % 2 === 0 ? themes.sky : themes.pink;
};

// --- DYNAMIC WATERMARKS ---
export const getWatermark = (index = 0) => {
  const shapes = [
    "M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z", // Sparkle
    "M12 2L2 12l10 10 10-10L12 2z", // Diamond
    "M13 10V3L4 14h7v7l9-11h-7z", // Lightning
    "M21 7.02v9.96l-9 5.02-9-5.02V7.02L12 2l9 5.02z", // Hexagon
    "M12 2L2 22h20L12 2z", // Mountain
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" // Shield
  ];
  return shapes[index % shapes.length];
};

// --- ACTIVE SESSION TIMER ---
function ActiveSession({ activeTask, startTime, onFinish }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentElapsedSecs = Math.floor((now - startTime) / 1000);
  const remainingSecs = Math.max(0, Math.floor(activeTask.duration * 60) - currentElapsedSecs);
  
  const displayMins = Math.floor(remainingSecs / 60).toString().padStart(2, "0");
  const displaySecs = (remainingSecs % 60).toString().padStart(2, "0");

  const originalSecs = (activeTask.originalDuration || activeTask.duration) * 60;
  const progressPct = (remainingSecs / originalSecs) * 100;
  const theme = getPlayfulTheme(activeTask.priority);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 animate-in fade-in duration-500 py-4 md:py-8">
      <div className="text-center space-y-2 relative z-10">
        <div className="inline-flex items-center justify-center bg-white/10 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse" />
          In Progress
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight px-4 text-balance uppercase">{activeTask.title}</h2>
      </div>

      <div className={`relative w-full max-w-sm rounded-[32px] md:rounded-[40px] ${theme} flex flex-col items-center justify-center p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-colors duration-500 overflow-hidden`}>
        <svg className="absolute -bottom-10 -right-6 w-56 h-56 md:w-80 md:h-80 text-black opacity-[0.06] -rotate-12 pointer-events-none select-none" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>

        <div className="relative z-10 text-6xl md:text-7xl font-black tracking-tighter tabular-nums drop-shadow-md">
          {displayMins}<span className="text-5xl opacity-40">:</span>{displaySecs}
        </div>
        
        <div className="relative z-10 w-full mt-8 md:mt-10 space-y-3">
          <div className="h-3 md:h-4 w-full bg-black/10 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div className="h-full bg-black/90 rounded-full transition-all duration-1000 ease-linear shadow-md" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] md:text-xs font-bold opacity-70 uppercase tracking-widest px-1">
            <span>Remaining</span>
            <span>{activeTask.originalDuration || Math.ceil(activeTask.duration)}m</span>
          </div>
        </div>
      </div>

      <button onClick={onFinish} className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-white text-black text-xs md:text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        Complete Session
      </button>
    </div>
  );
}

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
      const res = await fetch(API_BASE, { method: "GET", headers: { "Content-Type": "application/json", "x-flux-key": userKey } });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError("Connection lost.");
    } finally {
      setLoading(false);
    }
  }, [userKey]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleLogin = (e) => {
    e.preventDefault();
    const key = entryKey.trim();
    if (!key) return;
    localStorage.setItem("FLUX_KEY", key);
    setUserKey(key);
  };

const handleLogout = () => {
  const confirmLogout = window.confirm("Terminate session?");
  if (confirmLogout) {
    localStorage.removeItem("FLUX_KEY");
    setUserKey(null); // This is the most important line
    setTasks([]);
    window.location.hash = "/"; // Reset route just in case
  }
};
  const { fits, epics } = useMemo(() => {
    const priorityScore = { high: 3, medium: 2, low: 1 };
    const sorted = [...tasks].sort((a, b) => {
      const diff = (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      return diff !== 0 ? diff : b.duration - a.duration;
    });
    return {
      fits: sorted.filter((t) => Math.floor(t.duration) <= selectedTime),
      epics: sorted.filter((t) => Math.floor(t.duration) > selectedTime),
    };
  }, [tasks, selectedTime]);

  const handleStart = (task) => {
    setActiveTask(task);
    setStartTime(Date.now());
  };

  const handleFinish = async () => {
    const elapsedMins = (Date.now() - startTime) / 60000;
    const newDuration = Math.max(0, activeTask.duration - elapsedMins);
    try {
      await fetch(`${API_BASE}/${activeTask._id}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json", "x-flux-key": userKey }, 
        body: JSON.stringify({ duration: newDuration }) 
      });
    } catch (err) {}
    setActiveTask(null);
    setStartTime(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Discard this objective?")) return;
    try { await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { "x-flux-key": userKey } }); fetchTasks(); } catch (err) {}
  };

  if (!userKey) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-4 md:p-6 text-white font-sans">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 md:space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#E2FF31]">flux.</h1>
            <p className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest">Connect Identity</p>
          </div>
          <div className="bg-[#121216] rounded-[24px] md:rounded-[32px] p-5 md:p-6 space-y-5 shadow-2xl border border-white/5">
            <input
              type="password" autoFocus placeholder="Private Key..."
              className="w-full bg-[#0A0A0C] rounded-[16px] md:rounded-[20px] py-3 px-4 text-center text-base md:text-lg font-bold outline-none focus:ring-2 focus:ring-[#E2FF31]/30 transition-all placeholder:text-white/20 border border-white/5"
              value={entryKey} onChange={(e) => setEntryKey(e.target.value)}
            />
            <button className="w-full py-3 md:py-4 rounded-[16px] md:rounded-[20px] bg-gradient-to-r from-[#E2FF31] to-[#C1DF10] text-black text-[10px] md:text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(226,255,49,0.2)]">
              Enter
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white px-4 md:px-6 pt-6 md:pt-8 pb-16 font-sans selection:bg-[#E2FF31] selection:text-black relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[300px] bg-[#E2FF31]/5 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 relative z-10">
        <Header onLogout={handleLogout} />

        {!activeTask && (
          <nav className="flex items-center gap-2 md:gap-3 border-b border-white/5 pb-4 md:pb-6 overflow-x-auto no-scrollbar">
            {[
              { path: "/", label: "Focus", activeTheme: "bg-gradient-to-br from-[#D8B4FE] to-[#A874FA] text-black border-transparent shadow-md" },
              { path: "/add", label: "Compile", activeTheme: "bg-gradient-to-br from-[#E2FF31] to-[#C1DF10] text-black border-transparent shadow-md" },
              { path: "/vault", label: "Vault", activeTheme: "bg-gradient-to-br from-[#FFC29F] to-[#FF8B3D] text-black border-transparent shadow-md" }
            ].map((tab) => (
              <Link key={tab.path} to={tab.path}
                className={`px-5 py-2.5 md:px-6 md:py-3 rounded-[12px] md:rounded-[16px] text-[9px] md:text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap border ${location.pathname === tab.path ? tab.activeTheme : 'bg-[#121216] border-white/5 text-white/50 hover:bg-white/5 hover:text-white'}`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        )}

        {error && <div className="text-black font-bold text-xs bg-[#FFADF0] p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg">{error}</div>}

        <main className="animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={
              activeTask ? <ActiveSession activeTask={activeTask} startTime={startTime} onFinish={handleFinish} />
              : loading ? <div className="py-20 text-center text-white/30 font-bold text-xs md:text-sm uppercase tracking-widest">Syncing Protocol...</div>
              : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                  <div className="lg:col-span-4">
                    <TimeSelection selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                  </div>
                  <div className="lg:col-span-8">
                    <Recommendation fits={fits} epics={epics} onStart={handleStart} onDelete={handleDelete} />
                  </div>
                </div>
              )
            } />
            <Route path="/add" element={<BulkAddView onInject={fetchTasks} userKey={userKey} apiBase={API_BASE} />} />
            <Route path="/vault" element={<VaultView tasks={tasks} onDelete={handleDelete} />} />
          </Routes>
        </main>
      </div>
      <Analytics />
    </div>
  );
}

export default App;