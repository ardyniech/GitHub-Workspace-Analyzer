import React from 'react';
import { SecurityFinding } from '../storage/scannerRules';
import { AlertCircle, AlertTriangle, Key, Package, Code } from 'lucide-react';

interface SecurityFindingsListProps {
  findings: SecurityFinding[];
}

export function SecurityFindingsList({ findings }: SecurityFindingsListProps) {
  if (findings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-xs">
      <span className="font-bold text-zinc-800 text-[11px] flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-zinc-600" />
        Daftar Temuan Keamanan ({findings.length}):
      </span>

      <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
        {findings.map((item) => {
          const isCritical = item.severity === 'critical';
          const Icon =
            item.type === 'secret_leak'
              ? Key
              : item.type === 'vulnerable_dep'
              ? Package
              : Code;

          return (
            <div
              key={item.id}
              className={`p-2 rounded-md border flex flex-col gap-1 ${
                isCritical
                  ? 'bg-red-50/80 border-red-200 text-red-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isCritical ? 'text-red-600' : 'text-amber-600'}`} />
                <span>{item.title}</span>
              </div>
              <p className="text-[10.5px] leading-tight text-zinc-700">{item.description}</p>
              {item.lineSnippet && (
                <div className="font-mono text-[9.5px] bg-zinc-900 text-zinc-100 p-1 rounded overflow-x-auto">
                  <code>{item.lineSnippet}</code>
                </div>
              )}
              <div className="text-[10px] text-zinc-600 bg-white/70 p-1 rounded border border-zinc-200/50">
                <span className="font-semibold text-zinc-800">Saran: </span>
                {item.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
