import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header";
import TimeSelection from "./components/TimeSelection";
import Recommendation from "./components/Recommendation";
import BulkAddView from "./components/BulkAddView";
import VaultView from "./components/VaultView";

const API_BASE = "https://donext1.onrender.com/api/tasks";

// --- HELPERS ---
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

export const getWatermark = (index = 0) => {
  const shapes = [
    "M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z",
    "M12 2L2 12l10 10 10-10L12 2z",
    "M13 10V3L4 14h7v7l9-11h-7z",
    "M21 7.02v9.96l-9 5.02-9-5.02V7.02L12 2l9 5.02z",
    "M12 2L2 22h20L12 2z",
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  ];
  return shapes[index % shapes.length];
};

// --- TIMER COMPONENT ---
function ActiveSession({ activeTask, startTime, onFinish }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentElapsedSecs = Math.floor((now - startTime) / 1000);
  const totalDurationSecs = Math.floor(activeTask.duration * 60);
  const remainingSecs = Math.max(0, totalDurationSecs - currentElapsedSecs);
  
  const displayMins = Math.floor(remainingSecs / 60).toString().padStart(2, "0");
  const displaySecs = (remainingSecs % 60).toString().padStart(2, "0");
  const progressPct = (remainingSecs / totalDurationSecs) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 py-10 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E2FF31]/10 border border-[#E2FF31]/20">
          <span className="w-2 h-2 rounded-full bg-[#E2FF31] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E2FF31]">Flow Active</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
          {activeTask.title}
        </h2>
      </div>

      {/* CENTERPIECE: GLOWING COUNTDOWN */}
      <div className="relative group">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-[#E2FF31]/5 blur-[100px] rounded-full group-hover:bg-[#E2FF31]/10 transition-all duration-1000" />
        
        <div className="relative flex flex-col items-center">
          <div className="text-[8rem] md:text-[12rem] font-black tracking-tighter tabular-nums leading-none text-white selection:bg-[#E2FF31] selection:text-black">
            {displayMins}<span className="opacity-20 animate-pulse">:</span>{displaySecs}
          </div>
          
          {/* UNDERLINE PROGRESS BAR */}
          <div className="w-full max-w-md h-[2px] bg-white/10 mt-4 overflow-hidden relative">
            <div 
              className="absolute inset-y-0 right-0 bg-[#E2FF31] transition-all duration-1000 ease-linear shadow-[0_0_15px_#E2FF31]" 
              style={{ width: `${progressPct}%` }} 
            />
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="flex flex-col items-center space-y-4 w-full">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
          Session Volume: {Math.ceil(activeTask.duration)}M
        </p>
        <button 
          onClick={onFinish} 
          className="group relative px-12 py-5 bg-white text-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-[#E2FF31] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 font-black uppercase tracking-widest text-sm group-hover:text-black">
            End Session
          </span>
        </button>
      </div>
    </div>
  );
}

// --- MAIN APP ---
function App() {
  const [userKey, setUserKey] = useState(() => localStorage.getItem("FLUX_KEY"));
  const [entryKey, setEntryKey] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTime, setSelectedTime] = useState(30);
  const [activeTask, setActiveTask] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchTasks = useCallback(async () => {
    if (!userKey) return;
    setLoading(true);
    try {
      const res = await fetch(API_BASE, { method: "GET", headers: { "x-flux-key": userKey } });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) { console.error("Fetch Error:", err); }
    finally { setLoading(false); }
  }, [userKey]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleLogout = () => {
    if (window.confirm("Terminate?")) {
      localStorage.removeItem("FLUX_KEY");
      setUserKey(null);
      setTasks([]);
    }
  };

  const handleStart = (task) => {
    console.log("Starting task:", task.title);
    setActiveTask(task);
    setStartTime(Date.now());
  };

  const handleFinish = async () => {
    const elapsedMins = (Date.now() - startTime) / 60000;
    const newDuration = Math.max(0, activeTask.duration - elapsedMins);
    const targetId = activeTask._id;
    
    // Optimistic UI
    setTasks(prev => prev.map(t => t._id === targetId ? { ...t, duration: newDuration } : t));
    setActiveTask(null);
    setStartTime(null);

    try {
      await fetch(`${API_BASE}/${targetId}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json", "x-flux-key": userKey }, 
        body: JSON.stringify({ duration: newDuration }) 
      });
    } catch (err) { fetchTasks(); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Discard?")) return;
    const backup = [...tasks];
    setTasks(prev => prev.filter(t => t._id !== id));
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { "x-flux-key": userKey } });
    } catch (err) { setTasks(backup); }
  };

  const { fits, epics } = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      const ps = { high: 3, medium: 2, low: 1 };
      return (ps[b.priority] || 0) - (ps[a.priority] || 0);
    });
    return {
      fits: sorted.filter((t) => Math.floor(t.duration) <= selectedTime),
      epics: sorted.filter((t) => Math.floor(t.duration) > selectedTime),
    };
  }, [tasks, selectedTime]);

  if (!userKey) return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-6 text-white font-sans">
      <form onSubmit={(e) => { e.preventDefault(); const k = entryKey.trim(); localStorage.setItem("FLUX_KEY", k); setUserKey(k); }} className="w-full max-w-sm space-y-8">
        <h1 className="text-6xl font-black text-center text-[#E2FF31] tracking-tighter italic">flux.</h1>
        <div className="bg-[#121216] rounded-[40px] p-10 space-y-6 shadow-2xl border border-white/5">
          <input type="password" placeholder="Private Key" className="w-full bg-[#0A0A0C] rounded-2xl py-4 px-4 text-center outline-none border border-white/5 focus:ring-2 focus:ring-[#E2FF31]/30 transition-all" value={entryKey} onChange={(e) => setEntryKey(e.target.value)} />
          <button className="w-full py-4 rounded-2xl bg-[#E2FF31] text-black font-black uppercase tracking-widest active:scale-95 transition-all">Enter Vault</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white px-4 md:px-6 pt-8 pb-24 font-sans relative selection:bg-[#E2FF31] selection:text-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#E2FF31]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <Header onLogout={handleLogout} />

        {/* Layout Switcher: Show Timer OR Content */}
        {activeTask ? (
          <ActiveSession activeTask={activeTask} startTime={startTime} onFinish={handleFinish} />
        ) : (
          <>
            <nav className="flex items-center gap-3 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
              {[{ path: "/", label: "Focus", theme: "bg-white text-black" }, { path: "/add", label: "Compile", theme: "bg-[#E2FF31] text-black" }, { path: "/vault", label: "Vault", theme: "bg-[#FFC29F] text-black" }].map((tab) => (
                <Link key={tab.path} to={tab.path} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === tab.path ? tab.theme : 'bg-[#121216] text-white/40 hover:text-white'}`}>{tab.label}</Link>
              ))}
            </nav>

            <main className="animate-in fade-in duration-500">
              <Routes>
                <Route path="/" element={
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4"><TimeSelection selectedTime={selectedTime} setSelectedTime={setSelectedTime} /></div>
                    <div className="lg:col-span-8"><Recommendation fits={fits} epics={epics} onStart={handleStart} onDelete={handleDelete} /></div>
                  </div>
                } />
                <Route path="/add" element={<BulkAddView onInject={fetchTasks} userKey={userKey} apiBase={API_BASE} />} />
                <Route path="/vault" element={<VaultView tasks={tasks} onDelete={handleDelete} />} />
              </Routes>
            </main>
          </>
        )}
      </div>
      <Analytics />
    </div>
  );
}

export default App;