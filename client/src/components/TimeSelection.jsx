import { useState } from "react";

export default function TimeSelection({ selectedTime, setSelectedTime, onStart }) {
  const options = [15, 30, 45, 60];
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-3">
          {options.map((t) => (
            <button 
              key={t} 
              onClick={() => { setSelectedTime(t); setIsCustom(false); }} 
              className={`w-16 h-16 rounded-2xl text-xl font-bold transition-all border-2 
                ${selectedTime === t && !isCustom 
                  ? "bg-[#6C5CE7] border-[#6C5CE7] text-white shadow-lg" 
                  : "bg-white border-[#F1F2F6] text-[#636E72]"}`}
            >
              {t}
            </button>
          ))}
          <button 
            onClick={() => setIsCustom(true)}
            className={`w-16 h-16 rounded-2xl text-xl font-bold transition-all border-2 
              ${isCustom ? "border-[#6C5CE7] text-[#6C5CE7] bg-[#F1F2F6]" : "border-[#F1F2F6] text-[#B2BEC3]"}`}
          >
            +
          </button>
        </div>

        {isCustom && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <input 
              type="number"
              autoFocus
              placeholder="Enter mins..."
              onChange={(e) => setSelectedTime(Number(e.target.value))}
              className="bg-[#F1F2F6] border-2 border-[#6C5CE7] rounded-xl px-4 py-2 w-32 text-center font-bold text-[#6C5CE7] outline-none"
            />
          </div>
        )}
      </div>

      <button 
        onClick={onStart} 
        className="w-full bg-[#00B894] hover:bg-[#00A383] text-white py-5 rounded-2xl font-bold text-lg shadow-sm transition-all active:scale-95"
      >
        Initialize Focus Sequence
      </button>
    </div>
  );
}