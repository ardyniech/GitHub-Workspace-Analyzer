import React from 'react';
import { GitBranch } from 'lucide-react';

interface BranchInputProps {
  branch: string;
  onChangeBranch: (val: string) => void;
  defaultBranch?: string;
}

export function BranchInput({ branch, onChangeBranch, defaultBranch = 'main' }: BranchInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-zinc-700 flex items-center gap-1">
          <GitBranch className="w-3 h-3 text-indigo-600" />
          Cabang Target (Branch):
        </label>
        {branch !== defaultBranch && (
          <button
            type="button"
            onClick={() => onChangeBranch(defaultBranch)}
            className="text-[8.5px] text-indigo-600 hover:underline cursor-pointer"
          >
            Reset ke {defaultBranch}
          </button>
        )}
      </div>
      <input
        type="text"
        value={branch}
        onChange={(e) => onChangeBranch(e.target.value)}
        placeholder={`cth: ${defaultBranch} atau feature/nama-fitur`}
        className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-mono focus:border-indigo-500 focus:outline-hidden"
      />
    </div>
  );
}
