import { useState, useEffect } from "react";
import { getPlayfulTheme, getWatermark } from "../App";

export default function Recommendation({ fits, epics, onStart, onDelete }) {
  const [index, setIndex] = useState(0);

  useEffect(() => { setIndex(0); }, [fits]);

  const current = fits.length > 0 ? fits[Math.min(index, fits.length - 1)] : null;
  const canSkip = fits.length > 1;

  const handleSkip = () => setIndex((i) => (i + 1) % fits.length);
  const handleDelete = (id) => {
    if (index >= fits.length - 1) setIndex(0);
    onDelete(id);
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
      <section className="space-y-3 md:space-y-4">
        <div className="flex justify-between items-end px-1">
          <div className="space-y-1 md:space-y-1.5">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">Window</h3>
            <p className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Tasks that fit perfectly</p>
          </div>
          {canSkip && <span className="text-[10px] md:text-xs font-bold text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-1 md:mb-1.5">{index + 1} / {fits.length}</span>}
        </div>

        {current ? (
          <div className={`relative min-h-[200px] md:min-h-[240px] rounded-[24px] md:rounded-[40px] ${getPlayfulTheme(current.priority, index)} flex flex-col justify-between p-5 md:p-8 group shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden`}>
            
            <svg className="absolute -bottom-10 -right-6 w-48 h-48 md:w-64 md:h-64 text-black opacity-[0.06] -rotate-12 pointer-events-none select-none" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z" />
            </svg>

            <div className="relative z-10 flex justify-between items-start mb-6 md:mb-8">
              <div className="bg-black/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-1.5 border border-black/5 shadow-sm w-fit">
                <svg className="w-3 h-3 md:w-4 md:h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
                {Math.floor(current.duration)} MINS {current.isPartial && "• RESIDUE"}
              </div>
              <button onClick={() => handleDelete(current._id)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/10 flex items-center justify-center text-black/50 hover:bg-black/20 hover:text-black transition-all opacity-100 md:opacity-0 group-hover:opacity-100 shadow-sm border border-black/5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="relative z-10 space-y-5 md:space-y-6 w-full md:max-w-[85%]">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight drop-shadow-sm line-clamp-3">
                {current.title}
              </h2>
              
              <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3">
                {canSkip && (
                  <button onClick={handleSkip} className="px-5 h-10 md:h-12 rounded-full bg-black/10 text-[10px] md:text-xs font-black tracking-widest uppercase hover:bg-black/20 transition-all border border-black/5 shadow-sm flex-1 md:flex-none">
                    Skip
                  </button>
                )}
                <button onClick={() => onStart(current)} className="flex-1 w-full md:w-auto md:max-w-[200px] h-10 md:h-12 rounded-full bg-black text-white text-[10px] md:text-xs font-black tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                  Start Flow
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[160px] md:min-h-[200px] rounded-[24px] md:rounded-[40px] border-2 border-dashed border-white/10 flex items-center justify-center bg-[#121216]">
            <p className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-widest">Clear Schedule</p>
          </div>
        )}
      </section>

      {epics.length > 0 && (
        <section className="space-y-3 md:space-y-4">
          <div className="space-y-1 md:space-y-1.5 px-1">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">Horizon</h3>
            <p className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Bigger projects to chip away at</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {epics.map((task, idx) => {
              const theme = getPlayfulTheme(task.priority, idx);

              return (
                <div 
                  key={task._id} 
                  onClick={() => onStart(task)}
                  className={`relative min-h-[100px] md:min-h-[120px] rounded-[20px] md:rounded-[32px] ${theme} flex flex-col justify-between p-4 md:p-5 cursor-pointer group hover:scale-[1.02] active:scale-95 transition-all shadow-md overflow-hidden`}
                >
                  <svg className="absolute -bottom-6 -right-4 w-24 h-24 md:w-32 md:h-32 text-black opacity-[0.06] -rotate-12 pointer-events-none select-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d={getWatermark(idx)} />
                  </svg>

                  <div className="relative z-10 flex justify-between items-start mb-3 md:mb-4">
                    <span className="bg-black/10 border border-black/5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                      <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      </svg>
                      {Math.floor(task.duration)} MINS LEFT
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(task._id); }} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/10 border border-black/5 flex items-center justify-center text-black/50 hover:bg-black/20 hover:text-black transition-all opacity-100 md:opacity-0 group-hover:opacity-100 shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                  
                  <h3 className="relative z-10 text-lg md:text-xl font-black uppercase tracking-tight truncate w-[90%] leading-none drop-shadow-sm">
                    {task.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}