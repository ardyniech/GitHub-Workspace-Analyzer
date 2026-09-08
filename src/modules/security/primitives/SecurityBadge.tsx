import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Loader2 } from 'lucide-react';
import { ScanReport } from '../storage/securityScanner';

interface SecurityBadgeProps {
  report: ScanReport;
  scanning?: boolean;
  onToggleDetail?: () => void;
  showDetail?: boolean;
}

export function SecurityBadge({ report, scanning, onToggleDetail, showDetail }: SecurityBadgeProps) {
  if (scanning) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 text-[10.5px]">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
        <span>Memindai keamanan kode...</span>
      </div>
    );
  }

  if (report.hasCritical) {
    return (
      <button
        type="button"
        onClick={onToggleDetail}
        className="flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-[10.5px] font-semibold transition-colors cursor-pointer w-full text-left"
      >
        <div className="flex items-center gap-1.5">
          <ShieldX className="w-4 h-4 text-red-600 shrink-0" />
          <span>Bahaya: Kunci rahasia/celah kritis terdeteksi!</span>
        </div>
        <span className="text-[9.5px] underline shrink-0">
          {showDetail ? 'Tutup Rincian' : 'Lihat Celah'}
        </span>
      </button>
    );
  }

  if (report.hasWarning) {
    return (
      <button
        type="button"
        onClick={onToggleDetail}
        className="flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-[10.5px] font-semibold transition-colors cursor-pointer w-full text-left"
      >
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Perhatian: Ditemukan dependensi atau konfigurasi berisiko.</span>
        </div>
        <span className="text-[9.5px] underline shrink-0">
          {showDetail ? 'Tutup Rincian' : 'Lihat Saran'}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-medium">
      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
      <span>Keamanan Terverifikasi: Tidak ada kunci rahasia atau dependensi berbahaya.</span>
    </div>
  );
}
