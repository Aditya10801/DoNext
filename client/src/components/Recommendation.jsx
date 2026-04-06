export default function Recommendation({ fits, epics, onStart, onDelete }) {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <section className="space-y-6">
        <p className="font-mono text-[10px] text-[#6b6a67] tracking-[0.2em]">FITS_YOUR_TIME</p>
        {fits.length > 0 ? (
          <div className="border border-white p-8 bg-[#111110] space-y-8 relative group">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-4xl font-serif text-white leading-tight capitalize">{fits[0].title}</h2>
                <button
                  onClick={() => onDelete(fits[0]._id)}
                  className="shrink-0 font-mono text-[10px] border border-[#3a3a3a] text-[#6b6a67] px-3 py-1.5 hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  DISCARD
                </button>
              </div>
              <div className="flex gap-4 font-mono text-[9px] text-[#6b6a67]">
                <span>{fits[0].duration} MIN</span>
                {fits[0].isPartial && <span className="text-white tracking-widest">[RESIDUE]</span>}
              </div>
            </div>
            <button onClick={() => onStart(fits[0])} className="w-full bg-white text-black py-5 font-bold text-[11px] tracking-[0.2em] hover:bg-[#fafafa]">
              START
            </button>
          </div>
        ) : (
          <p className="font-serif italic text-[#2e2d2b] text-center py-4 border border-dashed border-[#2e2d2b]">No matches.</p>
        )}
      </section>

      {epics.length > 0 && (
        <section className="space-y-6">
          <p className="font-mono text-[10px] text-[#6b6a67] tracking-[0.2em]">THE_HORIZON</p>
          <div className="divide-y divide-[#2e2d2b] border-t border-[#2e2d2b]">
            {epics.map((task) => (
              <div key={task._id} className="py-6 flex justify-between items-center gap-4">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-xl font-serif text-[#6b6a67] hover:text-white transition-colors capitalize truncate">{task.title}</h3>
                  <p className="font-mono text-[9px] text-[#2e2d2b]">{task.duration} MIN</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onDelete(task._id)}
                    className="font-mono text-[10px] border border-[#3a3a3a] text-[#6b6a67] px-3 py-1.5 hover:border-red-500 hover:text-red-400 transition-colors"
                  >
                    DISCARD
                  </button>
                  <button
                    onClick={() => onStart(task)}
                    className="font-mono text-[10px] border border-[#2e2d2b] px-6 py-2 text-[#6b6a67] hover:border-white hover:text-white transition-all"
                  >
                    START
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}