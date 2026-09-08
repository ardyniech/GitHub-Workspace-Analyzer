import React, { useState } from 'react';
import { GitSyncModal } from './GitSyncModal';
import { Button } from '../../../shared/atoms/Button';
import { UploadCloud } from 'lucide-react';

interface GitSyncButtonProps {
  defaultRepoFullName?: string;
  authToken?: string | null;
}

export function GitSyncButton({ defaultRepoFullName, authToken }: GitSyncButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
        icon={<UploadCloud className="w-3.5 h-3.5 text-zinc-700" />}
        className="h-7 text-[10.5px] font-bold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 px-2.5"
      >
        Push Git
      </Button>

      {isOpen && (
        <GitSyncModal
          onClose={() => setIsOpen(false)}
          defaultRepoFullName={defaultRepoFullName}
          authToken={authToken}
        />
      )}
    </>
  );
}
