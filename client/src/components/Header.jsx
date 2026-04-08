// components/Header.js
export default function Header({ onLogout }) {
  return (
    <header className="relative z-50 flex justify-between items-center px-1 py-2">
      <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#E2FF31] drop-shadow-[0_0_10px_rgba(226,255,49,0.2)]">
        flux.
      </h1>
      <button 
        onClick={() => {
          console.log("Logout triggered"); // Debugging check
          onLogout();
        }}
        type="button"
        className="w-10 h-10 rounded-full bg-[#121216] border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/5 transition-all duration-300 shadow-sm active:scale-90"
      >
        {/* Power Icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
        </svg>
      </button>
    </header>
  );
}