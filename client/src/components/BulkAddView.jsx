import { useState } from "react";

export default function BulkAddView({ onInject }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [isCustom, setIsCustom] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [isChippable, setIsChippable] = useState(false);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToQueue = () => {
    if (!title.trim() || !duration) return;
    setQueue([...queue, { title, duration: Number(duration), priority, isChippable }]);
    setTitle("");
    setIsChippable(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const requests = queue.map(t => 
      fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      })
    );
    await Promise.all(requests);
    setQueue([]);
    onInject();
    setLoading(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in">
      <div className="space-y-10">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Define objective..."
          className="w-full bg-transparent border-b border-[#2e2d2b] py-4 text-3xl font-serif focus:border-white focus:outline-none placeholder:text-[#2e2d2b] text-white"
        />

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] text-[#6b6a67]">DURATION</label>
            <div className="flex border border-[#2e2d2b]">
              {[15, 30, 45, 60].map(d => (
                <button key={d} onClick={() => {setDuration(d); setIsCustom(false)}} className={`px-4 py-2 font-mono text-[10px] ${duration === d && !isCustom ? "bg-white text-black" : "text-[#6b6a67]"}`}>{d}</button>
              ))}
              <button onClick={() => setIsCustom(true)} className={`px-4 py-2 font-mono text-[10px] ${isCustom ? "bg-white text-black" : "text-[#6b6a67]"}`}>+</button>
            </div>
          </div>
          
          {isCustom && (
            <input type="number" onChange={(e) => setDuration(e.target.value)} className="w-full bg-transparent border-b border-[#2e2d2b] py-2 font-mono text-sm text-white text-right outline-none" placeholder="00 MIN" />
          )}

          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] text-[#6b6a67]">Can we splitted into chunks ?</label>
            <div className="flex border border-[#2e2d2b]">
              <button onClick={() => setIsChippable(true)} className={`px-6 py-2 font-mono text-[10px] ${isChippable ? "bg-white text-black" : "text-[#6b6a67]"}`}>YES</button>
              <button onClick={() => setIsChippable(false)} className={`px-6 py-2 font-mono text-[10px] ${!isChippable ? "bg-white text-black" : "text-[#6b6a67]"}`}>NO</button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] text-[#6b6a67]">PRIORITY</label>
            <div className="flex border border-[#2e2d2b]">
              {['low', 'medium', 'high'].map(p => (
                <button key={p} onClick={() => setPriority(p)} className={`px-4 py-2 font-mono text-[10px] uppercase ${priority === p ? "bg-white text-black" : "text-[#6b6a67]"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={addToQueue} className="w-full border border-white py-4 text-[11px] font-bold tracking-[0.1em] hover:bg-white hover:text-black">
          ADD TO LIST
        </button>
      </div>

      {queue.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#2e2d2b]">
          <div className="divide-y divide-[#2e2d2b]">
            {queue.map((t, i) => (
              <div key={i} className="py-4 flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-white lowercase">{t.title}</p>
                  <p className="font-mono text-[9px] text-[#6b6a67]">{t.duration}M // {t.priority} {t.isChippable && "// CHIP_READY"}</p>
                </div>
                <button onClick={() => setQueue(queue.filter((_, idx) => idx !== i))} className="text-[#6b6a67]">×</button>
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="w-full bg-white text-black py-5 font-bold text-[11px] tracking-[0.2em]">
            {loading ? "SAVING..." : "SAVE EVERYTHING"}
          </button>
        </div>
      )}
    </div>
  );
}