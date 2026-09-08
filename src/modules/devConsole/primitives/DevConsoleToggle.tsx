import React, { useState } from 'react';
import { DevConsoleModal } from './DevConsoleModal';
import { Terminal } from 'lucide-react';

export function DevConsoleToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 right-3 p-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-full border border-zinc-700 shadow-xl z-40 transition-all duration-200 cursor-pointer opacity-40 hover:opacity-100"
        title="Buka Hidden Dev Console (Internal AI Reasoning & Stack Traces)"
      >
        <Terminal className="w-4 h-4" />
      </button>

      {isOpen && <DevConsoleModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
