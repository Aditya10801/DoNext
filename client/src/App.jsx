import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Header from "./components/Header";
import TimeSelection from "./components/TimeSelection";
import Recommendation from "./components/Recommendation";
import BulkAddView from "./components/BulkAddView";

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTime, setSelectedTime] = useState(30);
  const [activeTask, setActiveTask] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const location = useLocation();

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tasks");
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) { console.error("Sync Error"); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const { fits, epics } = useMemo(() => {
    const priorityScore = { high: 3, medium: 2, low: 1 };
    const sorted = [...tasks].sort((a, b) => {
      const scoreB = priorityScore[b.priority] || 0;
      const scoreA = priorityScore[a.priority] || 0;
      return scoreB !== scoreA ? scoreB - scoreA : b.duration - a.duration;
    });

    return {
      // Fits = tasks shorter than time OR long tasks marked as 'Chippable'
      fits: sorted.filter(t => t.duration <= selectedTime || t.isChippable),
      // Epics = long tasks that are NOT chippable
      epics: sorted.filter(t => t.duration > selectedTime && !t.isChippable)
    };
  }, [tasks, selectedTime]);

  const handleStart = (task) => {
    setActiveTask(task);
    setStartTime(Date.now());
  };

  const handleFinish = async () => {
    const elapsed = Math.floor((Date.now() - startTime) / 60000);
    const newDuration = activeTask.duration - elapsed;

    await fetch(`http://localhost:3000/api/tasks/${activeTask._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration: newDuration }),
    });

    setActiveTask(null);
    setStartTime(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Discard this objective?")) return;
    await fetch(`http://localhost:3000/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] px-6 py-12 md:py-24 font-sans uppercase tracking-tight">
      <div className="max-w-[480px] mx-auto space-y-16">
        <Header />
        
        {!activeTask && (
          <nav className="flex gap-12 border-b border-[#2e2d2b]">
            <Link to="/" className={`pb-2 text-[10px] font-bold tracking-[0.2em] relative ${location.pathname === "/" ? "text-white" : "text-[#6b6a67]"}`}>
              Focus {location.pathname === "/" && <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />}
            </Link>
            <Link to="/add" className={`pb-2 text-[10px] font-bold tracking-[0.2em] relative ${location.pathname === "/add" ? "text-white" : "text-[#6b6a67]"}`}>
              Compile {location.pathname === "/add" && <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />}
            </Link>
          </nav>
        )}

        <main className="animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={
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
              ) : (
                <div className="space-y-16">
                  <TimeSelection selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                  <Recommendation fits={fits} epics={epics} onStart={handleStart} onDelete={handleDelete} />
                </div>
              )
            } />
            <Route path="/add" element={<BulkAddView onInject={fetchTasks} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;