import React from 'react';
import { PeerReviewReport, PeerReviewFinding } from '../logic/types';
import { PeerReviewFindingItem } from './PeerReviewFindingItem';
import { Button } from '../../../shared/atoms/Button';
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck, X } from 'lucide-react';

interface PeerReviewModalProps {
  report: PeerReviewReport;
  onClose: () => void;
  onProceedAnyway?: () => void;
  onApplyFix?: (finding: PeerReviewFinding) => void;
}

export function PeerReviewModal({ report, onClose, onProceedAnyway, onApplyFix }: PeerReviewModalProps) {
  const getStatusDisplay = () => {
    switch (report.overallStatus) {
      case 'approved':
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
          label: 'Lolos Review (Approved)',
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        };
      case 'changes_requested':
        return {
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          label: 'Perlu Perbaikan (Changes Requested)',
          bg: 'bg-red-50 text-red-900 border-red-200',
        };
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          label: 'Catatan Review (Commented)',
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">AI Peer Reviewer</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{report.targetIdentifier}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Score Banner */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${status.bg}`}>
          <div className="flex items-center gap-2">
            {status.icon}
            <span className="text-xs font-bold">{status.label}</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-black">{report.score}</span>
            <span className="text-[10px] opacity-75">/100 Skor Kualitas</span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-700 leading-relaxed">
          <p className="font-semibold text-zinc-900 mb-0.5 text-[11px]">Ulasan Senior Reviewer:</p>
          <p className="text-[11.5px]">{report.summary}</p>
        </div>

        {/* Findings List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[120px]">
          <span className="text-[11px] font-bold text-zinc-800">
            Daftar Temuan ({report.findings.length})
          </span>
          {report.findings.length === 0 ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Kode bersih! Tidak terdeteksi bug logika, redundansi, atau pelanggaran gaya.</span>
            </div>
          ) : (
            report.findings.map((finding) => (
              <PeerReviewFindingItem
                key={finding.id}
                finding={finding}
                onApplyFix={onApplyFix}
              />
            ))
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-2.5">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Tutup
          </Button>
          {onProceedAnyway && (
            <Button variant="primary" size="sm" onClick={onProceedAnyway} className="text-xs bg-zinc-900 text-white font-bold">
              Tetap Lanjutkan Push
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
