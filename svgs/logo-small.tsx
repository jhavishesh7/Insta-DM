export const LogoSmall = () => {
  return (
    <div className="flex items-center gap-x-3">
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-lg skew-x-[-4deg] shadow-[0_0_15px_rgba(74,125,255,0.4)] transition-transform hover:skew-x-0">
        <rect width="40" height="40" rx="10" fill="#4a7dff"/>
        <path d="M11 12H29V15L17 25V25.5H29V29H11V26L23 16V15.5H11V12Z" fill="white"/>
      </svg>
      <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
        Zero<span className="text-[#4a7dff]">Pilot</span>
      </h1>
    </div>
  );
};
