import React from 'react';
import { ManifestAuditResult } from '../logic/manifestTypes';
import { triggerAgentAuditExecution } from '../logic/triggerFixPr';
import { Button } from '../../../shared/atoms/Button';
import { Package, Zap, Bot } from 'lucide-react';

interface ManifestAuditSummaryBoxProps {
  repoFullName: string;
  result: ManifestAuditResult;
  upgrading: boolean;
  hasUpgrades: boolean;
  onAutoFixUpgrade: () => void;
}

export function ManifestAuditSummaryBox({
  repoFullName,
  result,
  upgrading,
  hasUpgrades,
  onAutoFixUpgrade,
}: ManifestAuditSummaryBoxProps) {
  if (!result.aiSummary) return null;

  return (
    <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-zinc-800 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 font-bold text-purple-900 text-[11px]">
          <Package className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Ringkasan Eksekutif Gemini</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => triggerAgentAuditExecution(repoFullName, result)}
            icon={<Bot className="w-3.5 h-3.5 text-emerald-300" />}
            className="h-6 text-[10.5px] px-2 bg-indigo-700 hover:bg-indigo-800 font-bold"
          >
            Eksekusi Fix via Agent
          </Button>
          {hasUpgrades && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onAutoFixUpgrade}
              disabled={upgrading}
              icon={<Zap className="w-3.5 h-3.5 text-amber-500" />}
              className="h-6 text-[10.5px] px-2 border-purple-200 hover:bg-purple-100 font-semibold"
            >
              Direct Fast Commit
            </Button>
          )}
        </div>
      </div>
      <p className="text-[11.5px] leading-relaxed text-zinc-700">{result.aiSummary}</p>
    </div>
  );
}
