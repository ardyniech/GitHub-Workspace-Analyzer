import React from 'react';
import { usePreFlight } from '../logic/usePreFlight';
import { X, ShieldAlert, CheckCircle, AlertTriangle, Play, RefreshCw, GitCommit, FileText, ArrowRight, Check } from 'lucide-react';
import { Button } from '../../../shared/atoms/Button';

interface PreFlightModalProps {
  onClose: () => void;
}

export function PreFlightModal({ onClose }: PreFlightModalProps) {
  const { state, isRunning, triggerAudit, applyFix, reset } = usePreFlight();

  const badgeStyle = (s: string) => {
    const map: Record<string, string> = { critical: 'bg-red-50 text-red-700 border-red-200', warning: 'bg-amber-50 text-amber-700 border-amber-200', architectural: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    return map[s] || 'bg-zinc-50 text-zinc-700 border-zinc-200';
  };

  const banner = isRunning
    ? { bg: 'bg-amber-50 border-amber-200 text-amber-900', label: 'Sedang Memindai...', desc: 'Agen AI sedang mengaudit berkas-berkas komit lokal.' }
    : state.status === 'passed'
    ? { bg: 'bg-emerald-50 border-emerald-200 text-emerald-900', label: 'Pre-Flight Lolos (Safe for Push)', desc: 'Tidak ada pelanggaran arsitektur atau isu kritis keamanan yang terdeteksi.' }
    : state.status === 'failed'
    ? { bg: 'bg-rose-50 border-rose-200 text-rose-900', label: 'Push Diblokir (Violations Found)', desc: 'Silakan perbaiki masalah kritis di bawah sebelum melanjutkan push.' }
    : { bg: 'bg-zinc-50 border-zinc-200 text-zinc-800', label: 'Belum Dipindai', desc: 'Klik Jalankan Audit untuk meluncurkan asisten Pre-Flight.' };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[90vh] overflow-hidden text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">AI PR Pre-Flight Audit</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Audit peer-review tingkat tinggi untuk memeriksa celah keamanan dan pelanggaran arsitektur</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-2 min-w-0">
            <GitCommit className="w-4 h-4 text-zinc-400 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-[10px] text-zinc-500 uppercase leading-none">Local Commit</p>
              <p className="text-zinc-800 font-medium truncate mt-0.5">{state.commitMessage}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-[10px] text-zinc-500 uppercase leading-none">Score</p>
            <p className={`text-base font-extrabold ${state.score >= 80 ? 'text-emerald-600' : 'text-rose-500'}`}>{state.score}/100</p>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${banner.bg} flex items-start gap-2`}>
          {state.status === 'passed' ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />}
          <div>
            <h4 className="font-bold text-[11px] leading-tight">{banner.label}</h4>
            <p className="text-[10px] opacity-90 mt-0.5">{banner.desc}</p>
          </div>
          {!isRunning && (
            <div className="flex gap-1.5 ml-auto shrink-0">
              <Button size="sm" onClick={triggerAudit} icon={<Play className="w-3 h-3 text-rose-600 animate-pulse" />} className="h-6 text-[9.5px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200">Mulai Audit</Button>
              <button onClick={reset} className="p-1 rounded border border-zinc-200 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer" title="Reset State"><RefreshCw className="w-3 h-3" /></button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="text-[10px] font-extrabold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Berkas Terubah pada Komit Lokal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {state.filesReviewed.map((file, idx) => (
              <div key={idx} className="p-2 bg-white border border-zinc-200 rounded-lg flex flex-col gap-1">
                <span className="font-semibold text-zinc-800 truncate" title={file.filePath}>{file.filePath.split('/').pop()}</span>
                <span className="text-[9.5px] text-zinc-400">{file.linesChanged} baris terubah</span>
                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 mt-1">
                  <span className={`text-[9px] font-bold uppercase ${file.status === 'passed' ? 'text-emerald-600' : 'text-amber-600'}`}>{file.status}</span>
                  {file.issuesCount > 0 && <span className="text-[9px] font-bold text-rose-500">{file.issuesCount} Masalah</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[160px] flex flex-col gap-2 pr-1">
          <h4 className="text-[10px] font-extrabold text-zinc-600 uppercase tracking-wider">Hasil Analisis & Temuan Senior Audit</h4>
          {state.issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-50 rounded-xl border border-dashed border-zinc-200 text-zinc-400 gap-1.5">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
              <p className="font-bold text-zinc-700">Bersih dari Masalah Kritis!</p>
              <p className="text-[10px]">Semua berkas pada komit lokal ini lolos verifikasi standar produksi tinggi.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {state.issues.map((issue) => (
                <div key={issue.id} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-[10px] text-zinc-400 font-mono shrink-0">{issue.ruleId}</span>
                      <span className="font-bold text-zinc-800 truncate">{issue.ruleName}</span>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${badgeStyle(issue.severity)}`}>{issue.severity}</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 leading-relaxed font-medium">{issue.message}</p>
                  <div className="p-1.5 bg-white border border-zinc-100 rounded-lg text-[9.5px] text-zinc-500 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">Saran Fix: <strong className="text-zinc-700 font-bold">{issue.proposedFix}</strong></span>
                    </div>
                    <Button size="sm" onClick={() => applyFix(issue.id)} icon={<Check className="w-2.5 h-2.5" />} className="h-5 text-[9px] px-2 font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shrink-0 font-sans">Fix</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
