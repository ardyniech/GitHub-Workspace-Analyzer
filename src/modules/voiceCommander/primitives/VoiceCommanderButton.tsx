import React, { useState, useEffect } from 'react';
import { VoiceCommanderModal } from './VoiceCommanderModal';
import { Button } from '../../../shared/atoms/Button';
import { dispatcher } from '../../../core/dispatcher';
import { Mic } from 'lucide-react';

interface VoiceCommanderButtonProps {
  repoFullName?: string;
  token?: string | null;
}

export function VoiceCommanderButton({ repoFullName, token }: VoiceCommanderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = dispatcher.on('voice:open', () => setIsOpen(true));
    return () => unsub();
  }, []);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        icon={<Mic className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />}
        className="h-8 text-xs font-semibold px-2.5 bg-indigo-50/70 hover:bg-indigo-100/90 text-indigo-950 border border-indigo-200"
        title="Buka Voice Commander"
      >
        Voice Commander
      </Button>

      {isOpen && (
        <VoiceCommanderModal
          repoFullName={repoFullName}
          token={token}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
