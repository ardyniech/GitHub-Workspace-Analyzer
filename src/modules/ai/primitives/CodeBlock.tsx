import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('[Module:AI] Failed to copy code:', err);
    }
  };

  return (
    <div className="my-2.5 rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col font-mono shadow-xs">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 font-semibold select-none">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-purple-400" />
          <span className="uppercase tracking-wider font-bold text-zinc-300">{language || 'code'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors duration-150 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-3 text-[11px] leading-relaxed overflow-x-auto select-text font-mono max-h-[260px] whitespace-pre text-zinc-200">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
