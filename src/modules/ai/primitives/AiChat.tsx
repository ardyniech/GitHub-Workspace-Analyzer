import React, { useState } from 'react';
import { Play, TerminalSquare, RotateCcw, Cpu } from 'lucide-react';
import { useAi } from '../logic/useAi';
import { usePrDraftGenerator } from '../logic/usePrDraftGenerator';
import { useAgentPipeline, AgentTask } from '../logic/useAgentPipeline';
import { useLiveVoice } from '../logic/useLiveVoice';
import { useAuth } from '../../auth';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Button } from '../../../shared/atoms/Button';
import { AgentModals } from './AgentModals';
import { PrDraftCard } from './PrDraftCard';
import { AgentPipelineView } from './AgentPipelineView';

export function AiChat({ repoFullName, repoDescription, readmeText }: any) {
  const { token } = useAuth();
  const { messages, loading, activeModel, sendMessage, clearChat } = useAi(repoFullName, repoDescription, token);
  const { draft, generateDraft, clearDraft } = usePrDraftGenerator(repoFullName, token);
  const { tasks, pipelineStatus, startPipeline, clearPipeline } = useAgentPipeline(repoFullName, repoDescription, token);
  const { status: vStatus, errorMessage: vErr, volumeLevel: vLvl, startSession, stopSession } = useLiveVoice();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSend = () => { if (input.trim() && !loading && pipelineStatus === 'idle') sendMessage(input, readmeText); };
  
  const handleAutoFixPipeline = () => {
    const pipeline: Omit<AgentTask, 'status'>[] = [
      { id: '1', name: 'Analisis Kode Otonom', prompt: 'Deteksi anti-pattern atau masalah keamanan pada kode repository ini.' },
      { id: '2', name: 'Generasi Solusi', prompt: 'Tuliskan secara persis bagian kode yang perlu diperbaiki berdasarkan analisis sebelumnya.' },
      { id: '3', name: 'Eksekusi Push (Autonomous Action)', prompt: 'Keluarkan blok ```copilot berisi JSON commit message dan file path + content untuk memperbaiki masalah di atas secara langsung ke repository.' }
    ];
    setInput('Menjalankan Auto-Fix Pipeline...');
    startPipeline(pipeline, readmeText);
  };
  
  const quickAct = (cmd: string) => { setInput(cmd); sendMessage(cmd, readmeText); };

  const lastRes = [...messages].reverse().find(m => m.sender === 'assistant' && m.id !== 'welcome' && m.id !== 'welcome-reset');
  const lastCmd = [...messages].reverse().find(m => m.sender === 'user');
  
  const showSingleResponse = !loading && lastRes && tasks.length === 0;

  return (
    <>
      {isExpanded && <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm" onClick={() => setIsExpanded(false)} />}
      <div className={isExpanded ? 'fixed inset-2 md:inset-6 z-50 bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 flex flex-col p-4 md:p-6 text-zinc-300' : 'bg-zinc-950 rounded-xl border border-zinc-800 shadow-xs flex flex-col p-4 h-[580px] md:h-[640px] text-zinc-300'}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-bold text-white tracking-wide">AI AGENT EXECUTOR</h2>
          </div>
          <div className="flex items-center gap-2">
            {activeModel && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{activeModel}</span>}
            <Button size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-none">{isExpanded ? 'Collapse' : 'Expand'}</Button>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col overflow-y-auto pr-2 gap-4">
          {!lastRes && !loading && !draft && tasks.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
              <TerminalSquare className="w-12 h-12 text-zinc-700 mb-3" />
              <p className="text-sm font-medium text-zinc-400 mb-1">Menunggu Instruksi...</p>
              <p className="text-[10px] text-zinc-500 max-w-[250px]">Agen AI siap mengeksekusi analisis riil atau refactor otomatis tanpa dialog basa-basi.</p>
            </div>
          )}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
              <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-mono text-emerald-400 animate-pulse">Menjalankan Eksekusi...</p>
              <p className="text-[10px] text-zinc-500 mt-2 font-mono">{input || 'Processing task'}</p>
            </div>
          )}
          
          {tasks.length > 0 && (
             <AgentPipelineView tasks={tasks} status={pipelineStatus} repoFullName={repoFullName} />
          )}

          {showSingleResponse && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-xs font-mono text-emerald-400">EKSEKUSI SELESAI</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mb-3 bg-zinc-900 p-2 rounded-md border border-zinc-800">&gt; {lastCmd?.text}</div>
              <div className="bg-zinc-900 rounded-xl p-4 text-sm text-zinc-300 border border-zinc-800 shadow-inner overflow-x-auto custom-markdown-dark">
                <MarkdownRenderer text={lastRes.text} repoFullName={repoFullName} />
              </div>
            </div>
          )}
          {draft && !loading && repoFullName && <PrDraftCard draft={draft} repoFullName={repoFullName} onClose={clearDraft} />}
        </div>

        {/* Input */}
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar">
            <button onClick={() => quickAct('Keluarkan blok ```copilot untuk perbaikan README repository ini.')} className="text-[10px] whitespace-nowrap bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 px-3 py-1.5 rounded-full transition-colors">Direct Push</button>
            <button onClick={handleAutoFixPipeline} className="text-[10px] whitespace-nowrap bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
              <Play className="w-3 h-3" /> Auto-Fix & Push
            </button>
          </div>
          <div className="flex gap-2 relative">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Masukkan instruksi eksekusi..." disabled={loading || pipelineStatus === 'running'} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50" />
            {(lastRes || tasks.length > 0) && <Button onClick={() => { clearChat(); clearPipeline(); setInput(''); clearDraft(); }} disabled={loading || pipelineStatus === 'running'} className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 rounded-lg"><RotateCcw className="w-4 h-4" /></Button>}
            <Button onClick={handleSend} disabled={loading || !input.trim() || pipelineStatus === 'running'} className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold disabled:opacity-50 border-none flex items-center gap-2">
              <Play className="w-4 h-4" /> Eksekusi
            </Button>
          </div>
        </div>
      </div>
      <AgentModals activeModal={activeModal} setActiveModal={setActiveModal} repoFullName={repoFullName} token={token} voiceProps={{ status: vStatus, errorMessage: vErr, volumeLevel: vLvl, startVoice: () => startSession(repoFullName), stopVoice: stopSession }} />
    </>
  );
}
