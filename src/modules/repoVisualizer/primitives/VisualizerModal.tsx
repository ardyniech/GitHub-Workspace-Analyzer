import React, { useState } from 'react';
import { useVisualizer } from '../logic/useVisualizer';
import { RepoTreeView } from './RepoTreeView';
import { ArchitectureDiagramView } from './ArchitectureDiagramView';
import { Button } from '../../../shared/atoms/Button';
import { X, Network, FolderKanban, Bot, RefreshCw } from 'lucide-react';

interface VisualizerModalProps {
  onClose: () => void;
}

export function VisualizerModal({ onClose }: VisualizerModalProps) {
  const { state, isDispatching, dispatchRefactorTask, reset } = useVisualizer();
  const [activeTab, setActiveTab] = useState<'architecture' | 'files'>('architecture');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3.5 max-h-[90vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Network className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Real-Time Repository Visualizer</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Struktur folder riil & peta arsitektur modul sistem, diperbarui langsung saat agen melakukan refaktor
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
          {/* Navigation Tab */}
          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 self-start">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1 text-[9.5px] font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'architecture' ? 'bg-white text-indigo-700 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Peta Arsitektur (ERD)
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1 text-[9.5px] font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'files' ? 'bg-white text-indigo-700 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              Struktur Folder (Hierarchy)
            </button>
          </div>

          {/* Real Agent Refactor Task Dispatch Button */}
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={dispatchRefactorTask}
              disabled={isDispatching}
              icon={<Bot className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin text-indigo-600' : 'text-indigo-600'}`} />}
              className="h-7 text-[10px] font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-xs"
            >
              {isDispatching ? 'Mengirim Task ke Agen...' : 'Tugaskan Agen Refactor'}
            </Button>
            <button
              onClick={reset}
              className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              title="Reset Visualisasi"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto min-h-[260px] bg-zinc-50/50 rounded-xl border border-zinc-200 p-3">
          {activeTab === 'architecture' ? (
            <ArchitectureDiagramView nodes={state.nodes} relations={state.relations} />
          ) : (
            <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
              <RepoTreeView node={state.treeData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
