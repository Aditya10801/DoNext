import { useState } from "react";

export default function TimeSelection({ selectedTime, setSelectedTime }) {
  const options = [15, 30, 45, 60];
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-px bg-[#2e2d2b] border border-[#2e2d2b]">
        {options.map((t) => (
          <button
            key={t}
            onClick={() => { setSelectedTime(t); setIsCustom(false); }}
            className={`py-4 font-mono text-sm transition-all ${
              selectedTime === t && !isCustom ? "bg-[#fafafa] text-[#0a0a0a]" : "bg-[#0a0a0a] text-[#6b6a67] hover:text-[#fafafa]"
            }`}
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setIsCustom(true)}
          className={`py-4 font-mono text-sm transition-all ${
            isCustom ? "bg-[#fafafa] text-[#0a0a0a]" : "bg-[#0a0a0a] text-[#6b6a67]"
          }`}
        >
          {isCustom ? ".." : "+"}
        </button>
      </div>

      {isCustom && (
        <div className="flex items-center border border-[#2e2d2b] bg-[#111110] px-4">
          <span className="font-mono text-[9px] text-[#6b6a67] mr-4">SET_INTERVAL:</span>
          <input
            type="number"
            autoFocus
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            className="w-full py-3 font-mono text-sm outline-none bg-transparent text-white"
            placeholder="00"
          />
        </div>
      )}
    </div>
  );
}