import { getPlayfulTheme, getWatermark } from "../App";

export default function VaultView({ tasks, onDelete }) {
  const sorted = [...tasks].sort((a, b) => {
    const ps = { high: 3, medium: 2, low: 1 };
    return (ps[b.priority] || 0) - (ps[a.priority] || 0);
  });

  if (tasks.length === 0) {
    return <div className="py-20 text-center font-bold text-xs md:text-sm text-white/40 uppercase tracking-widest">Vault is empty.</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl md:text-3xl font-black text-white px-1 tracking-tight">Vault</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {sorted.map((task, idx) => {
          const remaining = Math.floor(task.duration);
          const theme = getPlayfulTheme(task.priority, idx);
          
          return (
            <div key={task._id} className={`relative min-h-[140px] md:min-h-[160px] rounded-[24px] md:rounded-[36px] ${theme} flex flex-col justify-between p-5 md:p-6 group shadow-lg hover:scale-[1.02] transition-transform overflow-hidden`}>
              
              <svg className="absolute -bottom-8 -right-4 w-36 h-36 md:w-48 md:h-48 text-black opacity-[0.06] -rotate-12 pointer-events-none select-none" viewBox="0 0 24 24" fill="currentColor">
                <path d={getWatermark(idx)} />
              </svg>

              <div className="relative z-10 flex justify-between items-start mb-4 md:mb-6">
                <div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter drop-shadow-sm leading-none">{task.title}</div>
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-black/60 uppercase tracking-widest mt-1 md:mt-1.5">
                    <svg className="w-3 h-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                    Remaining
                  </div>
                </div>
                <button onClick={() => onDelete(task._id)} className="w-8 h-8 md:w-10 md:h-10 bg-black/10 border border-black/5 rounded-full flex items-center justify-center text-black/50 hover:bg-black/20 hover:text-black transition-all opacity-100 md:opacity-0 group-hover:opacity-100 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="relative z-10 space-y-2 md:space-y-3 w-[90%]">
                 <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none drop-shadow-sm truncate">{remaining} m </h3>
                 <div className="flex gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/70 bg-black/5 border border-black/5 w-fit px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm">
                   <span>{task.priority}</span>
                   {task.isChippable && <span>• CHIP</span>}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}