export default function Recommendation({ suggestion, next, onCommence, selectedTime }) {
  return (
    <div className="bg-[#F8F9FA] p-8 rounded-3xl space-y-6 border border-[#F1F2F6] animate-in fade-in zoom-in duration-500">
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0984E3]">
          Your next objective:
        </span>
        <h2 className="text-3xl font-extrabold text-[#2D3436] leading-tight">
          {suggestion.title}
        </h2>
        <div className="flex gap-2">
          <span className="bg-white border border-[#E0E0E0] text-[#636E72] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {suggestion.duration} MINS
          </span>
          <span className={`text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest
            ${suggestion.priority === 'high' ? 'bg-[#FF7675]' : 'bg-[#FAB1A0]'}`}>
            {suggestion.priority}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button 
          onClick={onCommence}
          className="bg-[#6C5CE7] text-white py-5 rounded-2xl font-bold text-lg shadow-md hover:brightness-110 transition-all active:scale-[0.98]"
        >
          {Number(suggestion.duration) > Number(selectedTime) 
            ? `Do a ${selectedTime}m session` 
            : "Start this task"}
        </button>
        <button 
          onClick={next} 
          className="text-[#B2BEC3] hover:text-[#636E72] text-sm font-bold py-2 transition-colors"
        >
          Not feeling this? Skip to next.
        </button>
      </div>
    </div>
  );
}