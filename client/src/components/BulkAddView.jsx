import { useState } from "react";

export default function BulkAddView({ onInject, loading }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(15);
  const [priority, setPriority] = useState("medium");
  const [effort, setEffort] = useState("medium");
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [queue, setQueue] = useState([]);

  const addToQueue = () => {
    if (!title.trim()) return;
    setQueue([...queue, { title, duration: Number(duration), priority, effort }]);
    setTitle(""); 
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="space-y-6 bg-[#FBFBFC] p-6 rounded-[2rem] border border-[#F1F2F6]">
        {/* Title Input */}
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addToQueue()}
          placeholder="Objective name..."
          className="w-full bg-white border border-[#E0E0E0] rounded-xl p-4 text-lg outline-none focus:border-[#6C5CE7] transition-all"
        />

        <div className="space-y-4">
          {/* Duration with Custom Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#B2BEC3]">Time (Mins)</span>
            <div className="flex gap-2">
              {[15, 30, 45].map(t => (
                <button key={t} onClick={() => {setDuration(t); setIsCustomTime(false)}} className={`px-3 py-1 rounded-lg text-xs font-bold ${duration === t && !isCustomTime ? 'bg-[#6C5CE7] text-white' : 'bg-white text-[#B2BEC3] border border-[#F1F2F6]'}`}>{t}</button>
              ))}
              <button onClick={() => setIsCustomTime(true)} className={`px-3 py-1 rounded-lg text-xs font-bold ${isCustomTime ? 'bg-[#6C5CE7] text-white' : 'bg-white text-[#B2BEC3] border border-[#F1F2F6]'}`}>Custom</button>
            </div>
          </div>
          {isCustomTime && (
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-2 rounded-lg bg-white border border-[#6C5CE7] text-center text-sm font-bold" />
          )}

          {/* Priority Selection */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#B2BEC3]">Priority</span>
            <div className="flex bg-[#F1F2F6] p-1 rounded-xl w-48">
              {['low', 'medium', 'high'].map(p => (
                <button key={p} onClick={() => setPriority(p)} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${priority === p ? 'bg-white text-[#6C5CE7] shadow-sm' : 'text-[#B2BEC3]'}`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Effort Selection */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#B2BEC3]">Mental Effort</span>
            <div className="flex bg-[#F1F2F6] p-1 rounded-xl w-48">
              {['easy', 'medium', 'hard'].map(e => (
                <button key={e} onClick={() => setEffort(e)} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${effort === e ? 'bg-white text-[#00B894] shadow-sm' : 'text-[#B2BEC3]'}`}>{e}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={addToQueue} className="w-full bg-[#2D3436] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest">+ Add to List</button>
      </div>

      {/* Queue List */}
      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {queue.map((task, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#F1F2F6] shadow-sm">
                <div>
                  <p className="font-bold text-sm text-[#2D3436]">{task.title}</p>
                  <p className="text-[9px] uppercase font-black text-[#B2BEC3]">{task.duration}m • {task.priority} priority • {task.effort} effort</p>
                </div>
                <button onClick={() => setQueue(queue.filter((_, idx) => idx !== i))} className="text-red-300 hover:text-red-500 text-xl">×</button>
              </div>
            ))}
          </div>
          <button onClick={() => onInject(queue)} disabled={loading} className="w-full bg-[#6C5CE7] text-white py-5 rounded-2xl font-bold uppercase shadow-lg disabled:opacity-50">
            {loading ? "Syncing..." : `Commit ${queue.length} Objectives`}
          </button>
        </div>
      )}
    </div>
  );
}