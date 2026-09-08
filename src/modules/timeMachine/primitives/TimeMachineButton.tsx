import React, { useState } from 'react';
import { History } from 'lucide-react';
import { Button } from '../../../shared/atoms/Button';
import { TimeMachineModal } from './TimeMachineModal';

interface TimeMachineButtonProps {
  className?: string;
}

export function TimeMachineButton({ className = '' }: TimeMachineButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        onClick={() => setIsOpen(true)}
        icon={<History className="w-3.5 h-3.5 text-indigo-600" />}
        className={`h-7 text-[10px] font-bold bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 rounded-xl shadow-2xs transition-all ${className}`}
      >
        Time Machine
      </Button>

      {isOpen && <TimeMachineModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
