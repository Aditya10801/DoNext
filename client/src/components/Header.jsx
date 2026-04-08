export default function Header({ onLogout }) {
  return (
    <header className="flex justify-between items-center px-1">
      <h1 className="text-3xl font-black tracking-tighter text-[#E2FF31] drop-shadow-[0_0_10px_rgba(226,255,49,0.2)]">flux.</h1>
      <button 
        onClick={onLogout} 
        className="w-10 h-10 rounded-full bg-[#121216] border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all shadow-sm active:scale-90"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
          <path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
        </svg>
      </button>
    </header>
  );
}