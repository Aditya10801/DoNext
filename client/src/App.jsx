import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";


import Header from "./components/Header";
import TimeSelection from "./components/TimeSelection";
import Recommendation from "./components/Recommendation";
import BulkAddView from "./components/BulkAddView";

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTime, setSelectedTime] = useState(45);
  const [taskID, setTaskID] = useState(0);
  const [suggestion, setSuggestion] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();


  const isExecuteActive = location.pathname === "/";
  const isInjectActive = location.pathname === "/add";

  const handleCommence = (task) => {
    setActiveSession({
      task: task,
      minutes: selectedTime,
      seconds: 0,
    });
  };

  const recommendedTasks = useMemo(() => {
    const priorityScore = { high: 3, medium: 2, low: 1 };
    return tasks
      .filter((t) => Number(t.duration) <= Number(selectedTime))
      .sort((a, b) => {
        const scoreB = priorityScore[b.priority?.toLowerCase()] || 0;
        const scoreA = priorityScore[a.priority?.toLowerCase()] || 0;
        
      
        return scoreB !== scoreA
          ? scoreB - scoreA
          : Number(b.duration) - Number(a.duration);
      })
      .slice(0, 5);
  }, [tasks, selectedTime]);

  useEffect(() => {
    if (hasStarted && recommendedTasks.length > 0) {
      setSuggestion(recommendedTasks[taskID]);
    } else {
      setSuggestion(null);
    }
  }, [taskID, recommendedTasks, hasStarted]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/tasks");
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Database offline. Check your local server.");
      }
    };
    fetchTasks();
  }, []);

  const handleBulkInject = async (newTasks) => {
    setIsLoading(true);
    try {
      const requests = newTasks.map((task) =>
        fetch("http://localhost:3000/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        }),
      );
      const responses = await Promise.all(requests);
      if (responses.every((res) => res.ok)) {
        // Optimistic update of local state
        setTasks((prev) => [...prev, ...newTasks]);
        navigate("/");
      }
    } catch (err) {
      alert("Sync Error: Could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#2D3436] font-sans p-4 md:p-12 flex flex-col items-center selection:bg-[#6C5CE7] selection:text-white">
      <div className="w-full max-w-xl bg-white shadow-2xl shadow-gray-200/50 border border-[#E0E0E0] p-8 md:p-12 rounded-[2.5rem] transition-all">
        <Header />

        {/* Dynamic Nav Bar: Underline moves based on active route */}
        <nav className="mt-10 flex gap-8 text-xs font-bold border-b border-[#F1F2F6] relative">
          <Link
            to="/"
            className={`pb-4 transition-colors duration-300 relative ${
              isExecuteActive ? "text-[#6C5CE7]" : "text-[#B2BEC3] hover:text-[#636E72]"
            }`}
          >
            EXECUTE
            {isExecuteActive && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6C5CE7] rounded-full animate-in slide-in-from-left duration-300" />
            )}
          </Link>
          <Link
            to="/add"
            className={`pb-4 transition-colors duration-300 relative ${
              isInjectActive ? "text-[#6C5CE7]" : "text-[#B2BEC3] hover:text-[#636E72]"
            }`}
          >
            INJECT TASKS
            {isInjectActive && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6C5CE7] rounded-full animate-in slide-in-from-left duration-300" />
            )}
          </Link>
        </nav>

        <main className="mt-12">
          <Routes>
            <Route
              path="/"
              element={
                <div className="space-y-12">
           
                  {activeSession ? (
                    <div className="text-center space-y-6 py-10 animate-in fade-in zoom-in duration-500">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00B894]">Active Session</span>
                      <h2 className="text-4xl font-black text-[#2D3436] leading-tight">
                        {activeSession.task.title}
                      </h2>
                      <div className="text-6xl font-mono font-bold text-[#6C5CE7]">
                        {activeSession.minutes}:00
                      </div>
                      <button 
                        onClick={() => setActiveSession(null)}
                        className="text-[10px] font-bold text-[#FF7675] uppercase tracking-widest border border-[#FF7675] px-6 py-2 rounded-full hover:bg-[#FF7675] hover:text-white transition-all"
                      >
                        Terminate Session
                      </button>
                    </div>
                  ) : (
                    <>
                      <TimeSelection
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        onStart={() => {
                          setHasStarted(true);
                          setTaskID(0);
                        }}
                      />
                      <div className="pt-10 border-t border-[#F1F2F6]">
                        {hasStarted && suggestion ? (
                          <Recommendation
                            suggestion={suggestion}
                            selectedTime={selectedTime}
                            next={() =>
                              setTaskID(
                                (prev) => (prev + 1) % recommendedTasks.length,
                              )
                            }
                            onCommence={() => handleCommence(suggestion)}
                          />
                        ) : (
                          <div className="text-sm text-[#B2BEC3] text-center font-medium italic py-4">
                            Pick a duration to see your top objectives.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              }
            />
            <Route
              path="/add"
              element={
                <BulkAddView onInject={handleBulkInject} loading={isLoading} />
              }
            />
          </Routes>
        </main>
      </div>
      
      {/* Subtle Footer for ADHD reassurance */}
      <footer className="mt-8 text-[9px] uppercase tracking-widest text-[#B2BEC3] font-bold">
        Focus Engine v2.0 • Calm Tech Mode Active
      </footer>
    </div>
  );
}

export default App;