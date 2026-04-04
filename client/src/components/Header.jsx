export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#2D3436]">
          DONEXT<span className="text-[#6C5CE7]">.</span>
        </h1>
        <p className="text-[10px] text-[#B2BEC3] font-bold uppercase tracking-widest">
          Simple. Focused. Now.
        </p>
      </div>
      <div className="bg-[#F1F2F6] px-3 py-1 rounded-full text-[10px] font-bold text-[#636E72]">
        STABLE_READY
      </div>
    </header>
  );
}