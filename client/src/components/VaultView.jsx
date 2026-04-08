import { getPlayfulTheme, getWatermark } from "../App";

export default function VaultView({ tasks, onDelete }) {
  const sorted = [...tasks].sort((a, b) => {
    const ps = { high: 3, medium: 2, low: 1 };
    return (ps[b.priority] || 0) - (ps[a.priority] || 0);
  });

  if (tasks.length === 0) return <div className="py-20 text-center font-bold text-sm text-white/20 uppercase tracking-widest">Vault is empty</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <h3 className="text-3xl font-black text-white px-1 tracking-tight">Vault</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((task, idx) => {
          const remaining = Math.floor(task.duration);
          const theme = getPlayfulTheme(task.priority, idx);
          
          return (
            <div key={task._id} className={`relative min-h-[150px] rounded-[32px] ${theme} flex flex-col justify-between p-6 group shadow-lg hover:scale-[1.02] transition-transform overflow-hidden`}>
              <svg className="absolute -bottom-10 -right-6 w-44 h-44 text-black opacity-[0.05] -rotate-12 pointer-events-none select-none" viewBox="0 0 24 24" fill="currentColor">
                <path d={getWatermark(idx)} />
              </svg>

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="text-5xl font-black tracking-tighter drop-shadow-sm leading-none">{remaining}</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-black/60 uppercase tracking-widest mt-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    Mins Left
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(task._id); }} className="w-10 h-10 bg-black/10 border border-black/5 rounded-full flex items-center justify-center text-black/50 hover:bg-black/20 hover:text-black transition-all shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div className="relative z-10 space-y-2">
                 <h3 className="text-xl font-black uppercase tracking-tight leading-none drop-shadow-sm truncate w-[90%]">{task.title}</h3>
                 <div className="flex gap-2 text-[9px] font-black uppercase text-black/70 bg-black/5 w-fit px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
                   {task.priority} {task.isChippable && "• PROJECT"}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}