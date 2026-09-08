import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { AutoPilotBadge } from './AutoPilotBadge';
import { Trash2, ShieldAlert, GitPullRequest, Maximize2, Minimize2, Download, Mic, Brain, BrainCircuit, Activity, FlaskConical, Sparkles, BookOpen, ShieldCheck, HeartPulse, Wand2, Compass, PlayCircle, Zap, Layers, Cpu, Network } from 'lucide-react';

interface AiChatActionsProps {
  repoFullName: string | undefined;
  loading: boolean;
  isExpanded: boolean;
  canExport: boolean;
  onToggleExpand: () => void;
  onTriggerSecurityScan: () => void;
  onGeneratePrDraft: () => void;
  onTriggerContinuousDevelopment: () => void;
  onExportReport: () => void;
  onOpenModal: (name: string) => void;
  onClearChat: () => void;
}

export function AiChatActions(p: AiChatActionsProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <AutoPilotBadge />
      <Button variant="ghost" size="sm" onClick={p.onTriggerContinuousDevelopment} icon={<Cpu className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />} className="h-7 text-xs text-emerald-900 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-200">
        Auto-Dev
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('prPreFlight')} icon={<ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />} className="h-7 text-xs text-rose-950 bg-rose-50 hover:bg-rose-100 font-bold border border-rose-200">
        Pre-Flight
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('repoVisualizer')} icon={<Network className="w-3.5 h-3.5 text-emerald-600" />} className="h-7 text-xs text-emerald-900 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-200">
        Visualizer
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('agentTaskQueue')} icon={<Layers className="w-3.5 h-3.5 text-indigo-600" />} className="h-7 text-xs text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200">
        Antrean
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('proactiveLinter')} icon={<Zap className="w-3.5 h-3.5 text-amber-600" />} className="h-7 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 font-bold border border-amber-200">
        Linter
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('ciPipeline')} icon={<PlayCircle className="w-3.5 h-3.5 text-indigo-600" />} className="h-7 text-xs text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200">
        CI/CD
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('agentInsight')} icon={<Compass className="w-3.5 h-3.5 text-indigo-600" />} className="h-7 text-xs text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200">
        Insight
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('proactiveActions')} icon={<Wand2 className="w-3.5 h-3.5 text-purple-600" />} className="h-7 text-xs text-purple-900 bg-purple-50 hover:bg-purple-100 font-bold border border-purple-200">
        Proactive
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('systemHealth')} icon={<HeartPulse className="w-3.5 h-3.5 text-emerald-600" />} className="h-7 text-xs text-emerald-900 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-200">
        System Health
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('selfAudit')} icon={<ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />} className="h-7 text-xs text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200">
        Self-Audit
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('knowledgeBase')} icon={<BookOpen className="w-3.5 h-3.5 text-purple-600" />} className="h-7 text-xs text-purple-900 bg-purple-50 hover:bg-purple-100 font-bold border border-purple-200">
        Knowledge
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('autoImprovement')} icon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />} className="h-7 text-xs text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200">
        Style
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('unitTester')} icon={<FlaskConical className="w-3.5 h-3.5 text-emerald-600" />} className="h-7 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-200">
        Unit Test
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('performance')} icon={<Activity className="w-3.5 h-3.5 text-blue-600" />} className="h-7 text-xs text-blue-800 bg-blue-50 hover:bg-blue-100 font-bold border border-blue-200">
        Performa
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('learning')} icon={<BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />} className="h-7 text-xs text-indigo-800 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200">
        Skill
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('memory')} icon={<Brain className="w-3.5 h-3.5 text-purple-600" />} className="h-7 text-xs text-purple-800 bg-purple-50 hover:bg-purple-100 font-bold border border-purple-200">
        Memori
      </Button>
      <Button variant="ghost" size="sm" onClick={() => p.onOpenModal('voice')} disabled={!p.repoFullName} icon={<Mic className="w-3.5 h-3.5 text-purple-600" />} className="h-7 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold border border-purple-200">
        Suara
      </Button>
      <Button variant="ghost" size="sm" onClick={p.onGeneratePrDraft} disabled={p.loading || !p.repoFullName} icon={<GitPullRequest className="w-3.5 h-3.5 text-emerald-600" />} className="h-7 text-xs text-emerald-700 bg-emerald-50 font-bold border border-emerald-300">
        PR
      </Button>
      <Button variant="ghost" size="sm" onClick={p.onTriggerSecurityScan} disabled={p.loading || !p.repoFullName} icon={<ShieldAlert className="w-3.5 h-3.5 text-amber-600" />} className="h-7 text-xs text-amber-700 bg-amber-50 font-semibold border border-amber-300">
        Scan
      </Button>
      <Button variant="ghost" size="sm" onClick={p.onExportReport} disabled={!p.canExport} icon={<Download className="w-3.5 h-3.5 text-blue-600" />} className="h-7 text-xs text-blue-700 bg-blue-50 font-semibold border border-blue-200">
        Export
      </Button>
      <Button variant="ghost" size="sm" onClick={p.onToggleExpand} icon={p.isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />} className="h-7 text-xs text-zinc-700 hover:bg-zinc-100 font-semibold border border-zinc-200">
        {p.isExpanded ? 'Kecil' : 'Lega'}
      </Button>
      <Button variant="ghost" size="sm" icon={<Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-600" />} onClick={p.onClearChat} className="h-7 text-zinc-500 hover:text-red-600 hover:bg-red-50">
        Reset
      </Button>
    </div>
  );
}
