import React from 'react';
import { ShieldAlert, AlertOctagon, X, ArrowRight } from 'lucide-react';
import { Button } from '../../../shared/atoms/Button';
import { SecurityFinding } from '../storage/scannerRules';

interface SecurityWarningModalProps {
  findings: SecurityFinding[];
  onConfirmForcePush: () => void;
  onCancel: () => void;
}

export function SecurityWarningModal({
  findings,
  onConfirmForcePush,
  onCancel,
}: SecurityWarningModalProps) {
  const criticalCount = findings.filter((f) => f.severity === 'critical').length;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-red-500 rounded-xl shadow-2xl max-w-md w-full p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Peringatan Keamanan Kritis!
            </h3>
          </div>
          <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-700 leading-relaxed">
          Sistem mendeteksi <strong>{criticalCount} potensi celah keamanan</strong> (seperti kunci rahasia API atau dependensi rentan) pada berkas yang akan Anda simpan ke repositori publik.
        </p>

        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-1.5 text-xs text-red-900">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>Risiko Kebocoran Data</span>
          </div>
          <p className="text-[11px] text-red-800">
            Kunci API yang ter-commit ke GitHub dapat disalahgunakan oleh pihak tidak berwenang dalam hitungan menit.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
          <Button size="sm" variant="ghost" onClick={onCancel} className="text-xs font-semibold">
            Batalkan & Perbaiki
          </Button>
          <Button
            size="sm"
            onClick={onConfirmForcePush}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
          >
            Tetap Commit (Paksa)
          </Button>
        </div>
      </div>
    </div>
  );
}
