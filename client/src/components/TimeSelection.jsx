import { useState } from "react";

export default function TimeSelection({ selectedTime, setSelectedTime }) {
  const options = [15, 30, 45, 60];
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Duration</h3>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {options.map((t) => {
          const isActive = selectedTime === t && !isCustom;
          return (
            <button
              key={t}
              onClick={() => { setSelectedTime(t); setIsCustom(false); }}
              className={`h-12 md:h-16 rounded-[16px] md:rounded-[24px] border-2 transition-all flex items-center justify-center gap-1.5 ${
                isActive 
                  ? "border-[#E2FF31] bg-gradient-to-r from-[#E2FF31] to-[#C1DF10] text-black scale-[1.02] shadow-[0_0_15px_rgba(226,255,49,0.2)]" 
                  : "border-white/5 bg-[#121216] text-white hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <span className="text-xl md:text-2xl font-black tracking-tighter">{t}</span>
              <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-black/60" : "text-white/40"}`}>Min</span>
            </button>
          );
        })}
        
        <button
          onClick={() => setIsCustom(true)}
          className={`h-12 md:h-16 rounded-[16px] md:rounded-[24px] border-2 transition-all flex items-center justify-center ${
            isCustom 
              ? "border-[#D8B4FE] bg-gradient-to-r from-[#D8B4FE] to-[#A874FA] text-black scale-[1.02] shadow-[0_0_15px_rgba(216,180,254,0.2)]" 
              : "border-white/5 bg-[#121216] text-white hover:border-white/20 hover:bg-white/5"
          }`}
        >
          <span className="text-xl md:text-2xl font-black">+</span>
        </button>
      </div>

      {isCustom && (
        <div className="animate-in fade-in slide-in-from-top-2 pt-1 md:pt-2">
          <input
            type="number"
            autoFocus
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            className="w-full bg-[#121216] border-2 border-white/5 rounded-[16px] md:rounded-[24px] py-3 px-5 md:py-4 md:px-6 text-lg md:text-xl font-black text-white outline-none focus:border-[#D8B4FE] transition-colors placeholder:text-white/20 placeholder:font-bold shadow-inner"
            placeholder="Enter minutes..."
          />
        </div>
      )}
    </div>
  );
}