import React from 'react';
import { LearnedSkill } from '../logic/types';
import { Award, Zap, TrendingUp } from 'lucide-react';

export interface SkillCardProps {
  key?: React.Key;
  skill: LearnedSkill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-2xs flex flex-col gap-1.5 hover:border-purple-300 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="font-bold text-xs text-zinc-900 truncate">{skill.name}</span>
        </div>
        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
          Skor: {skill.confidenceScore}%
        </span>
      </div>

      <div className="text-[11px] text-zinc-600 flex flex-col gap-1 mt-0.5">
        <p><span className="font-semibold text-zinc-800">Kondisi Pemicu:</span> {skill.triggerCondition}</p>
        <p><span className="font-semibold text-purple-900">Aksi Rekomendasi:</span> {skill.recommendedAction}</p>
      </div>

      <div className="flex items-center justify-between text-[9.5px] text-zinc-400 border-t border-zinc-100 pt-1.5 mt-0.5">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> Diterapkan {skill.timesApplied}x
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-500" /> Diperbarui {new Date(skill.lastUpgradedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
