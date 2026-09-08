import React from 'react';
import { useAutoPilot } from '../logic/useAutoPilot';
import { Zap, ShieldCheck } from 'lucide-react';

export function AutoPilotBadge() {
  const { isAutoPilot, toggleAutoPilot } = useAutoPilot();

  return (
    <button
      type="button"
      onClick={toggleAutoPilot}
      title={
        isAutoPilot
          ? 'Mode Eksekusi Langsung Otonom Aktif (Klik untuk ubah ke review manual)'
          : 'Mode Review Manual Aktif (Klik untuk aktifkan eksekusi langsung otonom)'
      }
      className={`h-7 px-2.5 rounded-lg text-[10.5px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer select-none ${
        isAutoPilot
          ? 'bg-amber-500 text-white border-amber-600 shadow-xs hover:bg-amber-600 animate-pulse'
          : 'bg-zinc-100 text-zinc-600 border-zinc-300 hover:bg-zinc-200'
      }`}
    >
      {isAutoPilot ? <Zap className="w-3.5 h-3.5 fill-current" /> : <ShieldCheck className="w-3.5 h-3.5" />}
      <span>{isAutoPilot ? '⚡ Auto-Pilot: Langsung' : 'Manual Review'}</span>
    </button>
  );
}
