import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header";
import TimeSelection from "./components/TimeSelection";
import Recommendation from "./components/Recommendation";
import BulkAddView from "./components/BulkAddView";
import VaultView from "./components/VaultView";

const API_BASE = "https://donext1.onrender.com/api/tasks";

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
    } catch (err) {}
    finally { setLoading(false); }
  }, [userKey]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleLogout = () => {
    if (window.confirm("Terminate session?")) {
      localStorage.removeItem("FLUX_KEY");
      setUserKey(null);
      setTasks([]);
    }
  };

  const handleStart = (task) => {
    setActiveTask(task);
    setStartTime(Date.now());
  };

  const handleFinish = async () => {
    const elapsedMins = (Date.now() - startTime) / 60000;
    const newDuration = Math.max(0, activeTask.duration - elapsedMins);
    const targetId = activeTask._id;
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
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { "x-flux-key": userKey } });
      if (!res.ok) throw new Error();
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
        <h1 className="text-5xl font-black text-center text-[#E2FF31] tracking-tighter">flux.</h1>
        <div className="bg-[#121216] rounded-[32px] p-8 space-y-6 shadow-2xl border border-white/5">
          <input type="password" placeholder="Private Key" className="w-full bg-[#0A0A0C] rounded-2xl py-4 px-4 text-center outline-none border border-white/5 focus:ring-1 focus:ring-[#E2FF31]/50 transition-all" value={entryKey} onChange={(e) => setEntryKey(e.target.value)} />
          <button className="w-full py-4 rounded-2xl bg-[#E2FF31] text-black text-xs font-black uppercase tracking-widest active:scale-95 transition-all">Connect</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white px-4 md:px-6 pt-8 pb-24 font-sans selection:bg-[#E2FF31] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#E2FF31]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <Header onLogout={handleLogout} />

        {!activeTask && (
          <nav className="flex items-center gap-3 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
            {[{ path: "/", label: "Focus", theme: "bg-white text-black" }, { path: "/add", label: "Compile", theme: "bg-[#E2FF31] text-black" }, { path: "/vault", label: "Vault", theme: "bg-[#FFC29F] text-black" }].map((tab) => (
              <Link key={tab.path} to={tab.path} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === tab.path ? tab.theme : 'bg-[#121216] text-white/40 hover:text-white'}`}>{tab.label}</Link>
            ))}
          </nav>
        )}

        <main className="animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={
              activeTask ? <ActiveSession activeTask={activeTask} startTime={startTime} onFinish={handleFinish} /> : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4"><TimeSelection selectedTime={selectedTime} setSelectedTime={setSelectedTime} /></div>
                <div className="lg:col-span-8"><Recommendation fits={fits} epics={epics} onStart={handleStart} onDelete={handleDelete} /></div>
              </div>
            )} />
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