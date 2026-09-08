import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { PreCommitReport } from '../logic/preCommitRunner';
import { CheckCircle, XCircle, AlertTriangle, GitCommit, ShieldCheck } from 'lucide-react';

interface PreCommitTestModalProps {
  report: PreCommitReport;
  fileCount: number;
  onConfirmPush: () => void;
  onCancel: () => void;
}

export function PreCommitTestModal({
  report,
  fileCount,
  onConfirmPush,
  onCancel,
}: PreCommitTestModalProps) {
  const hasCritical = !report.passed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-900 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900">Uji Verifikasi Pra-Commit</h3>
              <p className="text-[10.5px] text-zinc-500">
                Pemeriksaan otomatis untuk {fileCount} berkas sebelum di-push ({report.durationMs}ms)
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              report.passed
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {report.passed ? 'Lulus 4/4' : `${report.failedTests} Masalah`}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-2.5 max-h-[340px] overflow-y-auto">
          {report.items.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1 transition-all ${
                item.passed
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : item.severity === 'error'
                  ? 'bg-red-50/60 border-red-200 text-red-900'
                  : 'bg-amber-50/60 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  {item.passed ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : item.severity === 'error' ? (
                    <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                  <span>{item.name}</span>
                </span>
                <span className="text-[9.5px] font-mono">
                  {item.passed ? 'LULUS' : item.severity === 'error' ? 'GAGAL' : 'PERINGATAN'}
                </span>
              </div>
              <p className="text-[10.5px] text-zinc-600 pl-5">{item.message}</p>
            </div>
          ))}
        </div>

        <div className="p-3.5 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            className="text-xs text-zinc-600 hover:bg-zinc-200"
          >
            {hasCritical ? 'Tutup & Perbaiki' : 'Batal'}
          </Button>

          <Button
            size="sm"
            onClick={onConfirmPush}
            icon={<GitCommit className="w-3.5 h-3.5" />}
            className={`text-xs font-bold ${
              hasCritical
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {hasCritical ? 'Tetap Push (Abaikan Uji)' : 'Lanjutkan Push ke GitHub'}
          </Button>
        </div>
      </div>
    </div>
  );
}
