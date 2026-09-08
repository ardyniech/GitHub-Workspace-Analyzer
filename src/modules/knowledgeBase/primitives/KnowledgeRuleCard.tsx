import React, { useState } from 'react';
import { ExtendedStyleRule } from '../logic/types';
import { Button } from '../../../shared/atoms/Button';
import { ShieldCheck, UserCheck, Edit3, Check, ToggleLeft, ToggleRight } from 'lucide-react';

interface KnowledgeRuleCardProps {
  key?: React.Key;
  rule: ExtendedStyleRule;
  onUpdate: (id: string, updates: Partial<ExtendedStyleRule>, note?: string) => void;
  onToggle: (id: string, currentStatus?: string) => void;
}

export function KnowledgeRuleCard({ rule, onUpdate, onToggle }: KnowledgeRuleCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [ruleText, setRuleText] = useState(rule.rule);
  const [rationaleText, setRationaleText] = useState(rule.rationale);
  const [impact, setImpact] = useState(rule.impactScore);

  const handleSave = () => {
    onUpdate(rule.id, { rule: ruleText, rationale: rationaleText, impactScore: Number(impact) }, 'Disunting oleh pengembang');
    setIsEditing(false);
  };

  const isDevModified = rule.updatedBy === 'developer' || rule.status === 'overridden' || rule.status === 'custom';
  const isDisabled = rule.status === 'disabled';

  return (
    <div className={`p-3 rounded-xl border transition-all ${isDisabled ? 'bg-zinc-100/60 border-zinc-200 opacity-60' : 'bg-zinc-50 border-zinc-200/90 hover:border-zinc-300'}`}>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={ruleText}
            onChange={(e) => setRuleText(e.target.value)}
            className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-bold"
          />
          <textarea
            value={rationaleText}
            onChange={(e) => setRationaleText(e.target.value)}
            className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs h-16"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-zinc-600">
              <span>Impact Score:</span>
              <input type="number" min="1" max="100" value={impact} onChange={(e) => setImpact(Number(e.target.value))} className="w-16 px-1 border rounded text-xs font-mono" />
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-6 text-[10px]">Batal</Button>
              <Button size="sm" variant="primary" onClick={handleSave} icon={<Check className="w-3 h-3" />} className="h-6 text-[10px]">Simpan</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              {isDevModified ? <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" /> : <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
              <span className={`font-bold text-xs truncate ${isDisabled ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>{rule.rule}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${isDevModified ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'}`}>
                {rule.status === 'custom' ? 'Custom Dev' : rule.status === 'overridden' ? 'Override Dev' : 'AI Learned'}
              </span>
              <button onClick={() => onToggle(rule.id, rule.status)} className="p-0.5 text-zinc-400 hover:text-zinc-700 cursor-pointer" title={isDisabled ? 'Aktifkan Rule' : 'Nonaktifkan Rule'}>
                {isDisabled ? <ToggleLeft className="w-4 h-4 text-zinc-400" /> : <ToggleRight className="w-4 h-4 text-emerald-600" />}
              </button>
              <button onClick={() => setIsEditing(true)} className="p-0.5 text-zinc-400 hover:text-indigo-600 cursor-pointer" title="Sunting Standar Ini">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">{rule.rationale}</p>
          {rule.overrideNote && <span className="text-[9.5px] italic text-purple-700 font-medium">Catatan Dev: {rule.overrideNote}</span>}
        </div>
      )}
    </div>
  );
}
