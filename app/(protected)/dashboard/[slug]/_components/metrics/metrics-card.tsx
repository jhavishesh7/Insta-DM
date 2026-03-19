"use client";

type Props = {
  dmCount: number;
  commentCount: number;
};

function MetricsCard({ dmCount, commentCount }: Props) {

  return (
    <div className="w-full flex lg:flex-row flex-col gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="p-8 bg-[#0c0d18]/40 backdrop-blur-3xl flex flex-col gap-y-16 rounded-2xl w-full lg:w-1/2 border border-white/[0.08] hover:border-[#4a7dff]/30 transition-all group relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] pointer-events-none opacity-20 ${i === 1 ? 'bg-[#4a7dff]' : 'bg-[#6c2bd9]'}`} />
          
          {i === 1 ? (
            <div className="relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#4a7dff]">Comments</h2>
              <p className="text-white/40 text-xs mt-1 font-medium">Automated Interactions</p>
            </div>
          ) : (
            <div className="flex flex-col relative z-10">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#6c2bd9]">Direct Messages</h2>
              <p className="text-white/40 text-xs mt-1 font-medium">AI-Powered Responses</p>
            </div>
          )}
          {i === 1 ? (
            <div className="relative z-10">
              <h3 className="text-6xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">{commentCount || 0}</h3>
              <p className="text-[10px] text-white/30 mt-4 font-bold uppercase tracking-widest">
                100% Engagement Efficiency
              </p>
            </div>
          ) : (
            <div className="relative z-10">
              <h3 className="text-6xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">{dmCount || 0}</h3>
              <p className="text-[10px] text-white/30 mt-4 font-bold uppercase tracking-widest">
                 100% Conversion Rate
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MetricsCard;
