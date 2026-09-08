import React, { useState } from 'react';
import { useDevConsole } from '../logic/useDevConsole';
import { Button } from '../../../shared/atoms/Button';
import { Terminal, Trash2, ShieldAlert, Cpu, X, Copy, Check } from 'lucide-react';

interface DevConsoleModalProps {
  onClose: () => void;
}

export function DevConsoleModal({ onClose }: DevConsoleModalProps) {
  const { logs, clearLogs } = useDevConsole();
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((l) => (filterLevel === 'all' ? true : l.level === filterLevel));

  const copyStack = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-950 rounded-2xl max-w-3xl w-full p-4 border border-zinc-800 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-900 text-emerald-400 rounded-lg border border-zinc-800">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-100 leading-none">Internal Dev Console & Reasoning Logs</h3>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                Debugging kelas produksi: Pantau penalaran internal AI Agent & stack traces real-time
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Clear Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {['all', 'reasoning', 'error', 'warn', 'info'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                  filterLevel === lvl ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          <Button size="sm" variant="ghost" onClick={clearLogs} icon={<Trash2 className="w-3 h-3 text-zinc-400" />} className="text-[10px] h-6 text-zinc-400 hover:text-red-400">
            Bersihkan Logs
          </Button>
        </div>

        {/* Console Log Output Window */}
        <div className="flex-1 overflow-y-auto bg-black rounded-xl p-3 border border-zinc-800/80 font-mono text-[11px] flex flex-col gap-2 min-h-[260px] max-h-[420px]">
          {filteredLogs.length === 0 ? (
            <div className="text-zinc-600 text-center my-auto">Tidak ada log untuk filter ini.</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex flex-col gap-1 p-2 bg-zinc-900/60 rounded-lg border border-zinc-800/50">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                      log.level === 'error' ? 'bg-red-950 text-red-400 border border-red-800' :
                      log.level === 'reasoning' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                      log.level === 'warn' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {log.level}
                    </span>
                    <span className="font-bold text-zinc-300">[{log.moduleName}]</span>
                  </div>
                  <span className="text-zinc-500">{new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>

                <p className="text-zinc-200 whitespace-pre-wrap leading-relaxed">{log.message}</p>

                {log.stackTrace && (
                  <div className="mt-1 p-2 bg-red-950/40 rounded border border-red-900/60 text-[10px] text-red-300 relative group">
                    <button
                      onClick={() => copyStack(log.id, log.stackTrace!)}
                      className="absolute top-1.5 right-1.5 p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded cursor-pointer"
                      title="Salin Stack Trace"
                    >
                      {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <span className="font-bold block mb-0.5 text-red-400">Stack Trace:</span>
                    <pre className="whitespace-pre-wrap overflow-x-auto">{log.stackTrace}</pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
