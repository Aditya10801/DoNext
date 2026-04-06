export default function VaultView({ tasks, onDelete }) {
  const priorityColor = { high: "#fff", medium: "#6b6a67", low: "#3a3a3a" };

  const sorted = [...tasks].sort((a, b) => {
    const ps = { high: 3, medium: 2, low: 1 };
    return (ps[b.priority] || 0) - (ps[a.priority] || 0);
  });

  if (tasks.length === 0) {
    return (
      <p className="font-serif italic text-[#2e2d2b] text-center py-12 border border-dashed border-[#2e2d2b]">
        Vault is empty.
      </p>
    );
  }

  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      <div className="flex justify-between font-mono text-[9px] text-[#3a3a3a] tracking-[0.2em] pb-2 border-b border-[#1a1a1a]">
        <span>TASK</span>
        <span>REMAINING</span>
      </div>

      {sorted.map((task) => {
        const original = task.originalDuration || task.duration;
        const remaining = task.duration;
        const pct = Math.max(0, Math.min(100, (remaining / original) * 100));
        const done = 100 - pct;

        return (
          <div key={task._id} className="py-5 border-b border-[#1a1a1a] space-y-3 group">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 min-w-0">
                <p
                  className="font-serif text-lg capitalize leading-tight"
                  style={{ color: priorityColor[task.priority] || "#6b6a67" }}
                >
                  {task.title}
                </p>
                <div className="flex gap-3 font-mono text-[9px] text-[#3a3a3a]">
                  <span>{task.priority.toUpperCase()}</span>
                  {task.isChippable && <span>CHIP</span>}
                  {task.isPartial && <span className="text-[#6b6a67]">IN PROGRESS</span>}
                </div>
              </div>
              <div className="text-right shrink-0 space-y-1">
                <p className="font-mono text-[11px] text-white">{remaining} MIN</p>
                {task.originalDuration && task.originalDuration !== remaining && (
                  <p className="font-mono text-[9px] text-[#3a3a3a]">of {original}</p>
                )}
              </div>
            </div>

            {/* progress bar */}
            <div className="h-[2px] w-full bg-[#1a1a1a] relative">
              <div
                className="absolute left-0 top-0 h-full bg-white transition-all duration-500"
                style={{ width: `${done}%` }}
              />
            </div>

            <button
              onClick={() => onDelete(task._id)}
              className="opacity-0 group-hover:opacity-100 font-mono text-[9px] text-[#3a3a3a] hover:text-red-400 transition-all"
            >
              DISCARD
            </button>
          </div>
        );
      })}
    </div>
  );
}