import { useState } from "react";
import { getPlayfulTheme } from "../App";

export default function BulkAddView({ onInject, userKey, apiBase }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [isCustom, setIsCustom] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [isChippable, setIsChippable] = useState(false);
  const [queue, setQueue] = useState([]);

  const addToQueue = () => {
    if (!title.trim() || !duration) return;
    setQueue([...queue, { title, duration: Number(duration), priority, isChippable }]);
    setTitle("");
    setIsChippable(false);
  };

  const handleSave = async () => {
    try {
      await Promise.all(queue.map((t) => fetch(apiBase, { method: "POST", headers: { "Content-Type": "application/json", "x-flux-key": userKey }, body: JSON.stringify(t) })));
      setQueue([]);
      onInject();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 animate-in fade-in">
      <div className="lg:col-span-7 space-y-4 md:space-y-6">
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Compile</h3>
        <div className="bg-[#121216] rounded-[24px] md:rounded-[40px] p-5 md:p-8 border border-white/5 shadow-2xl space-y-6 md:space-y-8">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addToQueue()}
            placeholder="What's the objective?"
            className="w-full bg-transparent text-xl md:text-3xl font-black text-white outline-none placeholder:text-white/20 tracking-tight"
          />
          
          <div className="space-y-5 md:space-y-6 pt-4 md:pt-6 border-t border-white/5">
            <div className="space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Duration</label>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {[15, 30, 45, 60].map((d) => (
                  <button key={d} onClick={() => { setDuration(d); setIsCustom(false); }} className={`h-10 md:h-12 rounded-[12px] md:rounded-[16px] font-black text-xs md:text-sm transition-all border ${duration === d && !isCustom ? "bg-[#E2FF31] border-[#E2FF31] text-black shadow-md scale-105" : "bg-white/5 border-transparent text-white hover:bg-white/10"}`}>
                    {d}
                  </button>
                ))}
              </div>
              {isCustom && (
                <input type="number" onChange={(e) => setDuration(e.target.value)} className="w-full bg-[#0A0A0C] border border-white/10 rounded-[12px] md:rounded-[16px] h-12 md:h-14 px-4 md:px-5 text-white text-base md:text-lg font-black outline-none focus:border-[#E2FF31] shadow-inner" placeholder="00 mins" />
              )}
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Priority</label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {["low", "medium", "high"].map((p) => {
                  const isActive = priority === p;
                  const themeBg = getPlayfulTheme(p).split(' ').find(c => c.startsWith('from-'));
                  const themeTo = getPlayfulTheme(p).split(' ').find(c => c.startsWith('to-'));
                  
                  return (
                    <button key={p} onClick={() => setPriority(p)} className={`h-10 md:h-12 rounded-[12px] md:rounded-[16px] font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all border ${isActive ? `bg-gradient-to-br ${themeBg} ${themeTo} border-transparent text-black shadow-md scale-105` : "bg-white/5 border-transparent text-white hover:bg-white/10"}`}>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button onClick={() => setIsChippable(!isChippable)} className={`w-full h-12 md:h-14 rounded-[16px] md:rounded-[20px] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all border ${isChippable ? "bg-white border-white text-black shadow-md" : "bg-white/5 border-transparent text-white hover:bg-white/10"}`}>
              Chippable Project
            </button>
          </div>

          <button onClick={addToQueue} className="w-full h-14 md:h-16 rounded-[16px] md:rounded-[24px] bg-gradient-to-r from-[#D8B4FE] to-[#A874FA] text-black text-xs md:text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(216,180,254,0.2)]">
            Add to Queue
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4 md:space-y-6">
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Queue</h3>
        <div className="space-y-3 md:space-y-4">
          {queue.length === 0 && <p className="text-white/30 font-bold text-xs md:text-sm uppercase tracking-widest bg-[#121216] border border-white/5 rounded-[20px] md:rounded-[24px] py-8 md:py-10 text-center">Queue is empty.</p>}
          
          {queue.map((t, i) => (
            <div key={i} className={`relative rounded-[20px] md:rounded-[28px] ${getPlayfulTheme(t.priority, i)} p-4 md:p-5 flex justify-between items-center group shadow-md overflow-hidden`}>
              <div className="relative z-10 w-[80%]">
                <p className="text-base md:text-lg font-black capitalize drop-shadow-sm leading-tight truncate">{t.title}</p>
                <div className="flex gap-2 text-[8px] md:text-[9px] font-black text-black/60 uppercase tracking-widest mt-1.5 md:mt-2 bg-black/5 w-fit px-2 py-1 rounded-full border border-black/5 shadow-sm">
                  <span>{t.duration}M</span>
                  <span>• {t.priority}</span>
                </div>
              </div>
              <button onClick={() => setQueue(queue.filter((_, idx) => idx !== i))} className="relative z-10 w-8 h-8 md:w-10 md:h-10 bg-black/10 border border-black/5 rounded-full flex items-center justify-center text-black/50 hover:bg-black/20 hover:text-black transition-all shadow-sm">
                <svg width="14" height="14" md:width="18" md:height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          ))}
          
          {queue.length > 0 && (
             <button onClick={handleSave} className="w-full h-14 md:h-16 mt-3 md:mt-4 rounded-[16px] md:rounded-[24px] bg-gradient-to-r from-[#E2FF31] to-[#C1DF10] text-black text-xs md:text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(226,255,49,0.2)] hover:scale-[1.02] transition-transform">
               Commit to Vault
             </button>
          )}
        </div>
      </div>
    </div>
  );
}