import React, { useState } from 'react';
import { useAutoLearning } from '../logic/useAutoLearning';
import { SkillCard } from './SkillCard';
import { Button } from '../../../shared/atoms/Button';
import { BrainCircuit, Activity, RotateCcw, Sparkles, X } from 'lucide-react';

interface AutoLearningModalProps {
  repoFullName?: string;
  onClose: () => void;
}

export function AutoLearningModal({ repoFullName, onClose }: AutoLearningModalProps) {
  const { skills, history, isAutoActive, setIsAutoActive, triggerManualCycle, resetAll } = useAutoLearning(repoFullName);
  const [activeTab, setActiveTab] = useState<'skills' | 'history'>('skills');
  const [obsInput, setObsInput] = useState('');

  const handleRunCycle = () => {
    if (!obsInput.trim()) return;
    triggerManualCycle(obsInput.trim());
    setObsInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Auto-Learning & Skill Engine</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Secara otonom menyerap wawasan dari audit, peer review, dan commit
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between p-2.5 bg-purple-50/60 rounded-xl border border-purple-200 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="font-bold text-purple-950">Mode Pembelajaran Otonom:</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAutoActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'}`}>
              {isAutoActive ? 'AKTIF (AUTONOMOUS)' : 'NONAKTIF'}
            </span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setIsAutoActive(!isAutoActive)} className="text-[10px] h-6 px-2 text-purple-800 hover:bg-purple-100">
            {isAutoActive ? 'Jeda' : 'Aktifkan'}
          </Button>
        </div>

        {/* Tab Selection & Reset */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-1">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('skills')}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'skills' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Skill Terlatih ({skills.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'history' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Riwayat Siklus ({history.length})
            </button>
          </div>
          <Button size="sm" variant="ghost" onClick={resetAll} icon={<RotateCcw className="w-3 h-3 text-zinc-400" />} className="text-[10px] h-6 text-zinc-500">
            Reset
          </Button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[180px]">
          {activeTab === 'skills' ? (
            skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)
          ) : (
            history.map((log) => (
              <div key={log.id} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="font-bold text-purple-800 uppercase">{log.source}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString('id-ID')}</span>
                </div>
                <p className="font-medium text-zinc-900">{log.observation}</p>
                <p className="text-[11px] text-purple-900 bg-purple-50 p-1.5 rounded-lg border border-purple-100 font-mono">{log.synthesis}</p>
              </div>
            ))
          )}
        </div>

        {/* Manual Trigger Box */}
        <div className="pt-2 border-t border-zinc-100 flex gap-2">
          <input
            type="text"
            placeholder="Masukkan observasi manual untuk menstimulasi pembelajaran..."
            value={obsInput}
            onChange={(e) => setObsInput(e.target.value)}
            className="flex-1 p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-purple-400"
          />
          <Button size="sm" variant="primary" onClick={handleRunCycle} icon={<Activity className="w-3.5 h-3.5" />} className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shrink-0">
            Jalankan Siklus
          </Button>
        </div>
      </div>
    </div>
  );
}
