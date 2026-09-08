import React, { useState } from 'react';
import { Layers, HelpCircle, RefreshCw } from 'lucide-react';

export function MemoryFragmentationOverlay() {
  const [fragmentation, setFragmentation] = useState(12); // 12% is highly optimal
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setFragmentation(Math.floor(Math.random() * 8) + 8); // fluctuates between 8% and 15%
      setIsCalibrating(false);
    }, 1200);
  };

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between pb-1 border-b border-dashed border-zinc-200">
        <span className="font-bold text-[10.5px] text-zinc-700 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
          Diagnostik Fragmentasi Memori AI
        </span>
        <button
          onClick={handleRecalibrate}
          disabled={isCalibrating}
          className="flex items-center gap-1 text-[9px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded transition-all cursor-pointer"
        >
          <RefreshCw className={`w-2.5 h-2.5 ${isCalibrating ? 'animate-spin' : ''}`} />
          <span>{isCalibrating ? 'Kalibrasi...' : 'Kalibrasi Ulang'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-[10px]">
        {/* Left: Interactive Partition Block Visualization */}
        <div className="flex flex-col gap-1.5 justify-center">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-zinc-500">Tingkat Fragmentasi:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded-md text-[9.5px] ${fragmentation < 15 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {fragmentation}% ({fragmentation < 15 ? 'Optimal' : 'Tercfragmentasi'})
            </span>
          </div>
          {/* Blocks */}
          <div className="grid grid-cols-10 gap-0.5 p-1 bg-zinc-200/50 rounded border border-zinc-200">
            {Array.from({ length: 40 }).map((_, idx) => {
              // Simulating filled blocks. Red ones indicate fragmented blocks, blue indicate active cache, green long-term insights
              let bg = 'bg-zinc-300'; // empty
              if (idx < 8) bg = 'bg-indigo-500'; // short-term
              else if (idx >= 8 && idx < 28) bg = 'bg-emerald-500'; // long-term
              else if (idx === 29 || idx === 34) bg = 'bg-rose-500 animate-pulse'; // fragmented
              return (
                <div
                  key={idx}
                  className={`h-2.5 rounded-[1px] ${bg}`}
                  title={idx < 8 ? 'Short-Term Interaction Cache' : idx < 28 ? 'Long-Term Insights' : idx === 29 || idx === 34 ? 'Memory Fragmentation Block' : 'Free Allocation Segment'}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Legend and Explainer */}
        <div className="flex flex-col gap-1 justify-center bg-white/70 p-2 rounded-lg border border-zinc-200/60 leading-relaxed text-zinc-600">
          <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
            <HelpCircle className="w-3 h-3 text-zinc-400" />
            <span>Alokasi Memori Agen</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-[2px]" />
            <span>**Short-Term Cache** (Interaksi Chat & State Luring)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-[2px]" />
            <span>**Long-Term Insights** (Peta Modul & Knowledge Base)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-[2px]" />
            <span>**Fragmentasi** (Sektor tidak terisi/bocor)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
