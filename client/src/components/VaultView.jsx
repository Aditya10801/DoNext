import { getPlayfulTheme, getWatermark } from "../App";

export default function VaultView({ tasks, onDelete }) {
  const sorted = [...tasks].sort((a, b) => {
    const ps = { high: 3, medium: 2, low: 1 };
    return (ps[b.priority] || 0) - (ps[a.priority] || 0);
  });

  if (tasks.length === 0) return (
    <div className="py-20 text-center font-bold text-sm text-white/20 uppercase tracking-widest animate-pulse">
      Vault empty
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="px-1">
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Vault</h3>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Your stored objectives</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {sorted.map((task, idx) => {
          const remaining = Math.floor(task.duration);
          const theme = getPlayfulTheme(task.priority, idx);
          
          return (
            <div 
              key={task._id} 
              className={`relative min-h-[170px] md:min-h-[190px] rounded-[32px] md:rounded-[40px] ${theme} flex flex-col justify-between p-6 md:p-7 group shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden`}
            >
              {/* LARGER, OFFSET WATERMARK */}
              <svg className="absolute -bottom-12 -right-8 w-48 h-48 text-black opacity-[0.05] -rotate-12 pointer-events-none select-none group-hover:rotate-0 transition-transform duration-700" viewBox="0 0 24 24" fill="currentColor">
                <path d={getWatermark(idx)} />
              </svg>

              {/* TOP ROW: TIME & DELETE */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-black tracking-tighter drop-shadow-sm leading-none">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-black/40 uppercase tracking-widest">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    Mins Left
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(task._id); }} 
                  className="w-10 h-10 md:w-11 md:h-11 bg-black/5 border border-black/5 rounded-full flex items-center justify-center text-black/30 hover:text-black hover:bg-black/10 hover:rotate-90 transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* BOTTOM ROW: TITLE & TAGS */}
              <div className="relative z-10 space-y-3">
                 <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none drop-shadow-sm truncate w-full pr-4">
                   {remaining}
                 </h3>
                 <div className="flex items-center gap-2">
                   <div className="text-[9px] font-black uppercase text-black/60 bg-black/5 px-3 py-1 rounded-full border border-black/5 shadow-sm">
                     {task.priority}
                   </div>
                   {task.isChippable && (
                     <div className="text-[9px] font-black uppercase text-black/60 bg-white/20 px-3 py-1 rounded-full border border-black/5 shadow-sm">
                       Chippable
                     </div>
                   )}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}