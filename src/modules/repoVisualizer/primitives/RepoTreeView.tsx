import React, { useState } from 'react';
import { RepoTreeNode } from '../logic/types';
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown } from 'lucide-react';

interface RepoTreeViewProps {
  key?: React.Key;
  node: RepoTreeNode;
}

export function RepoTreeView({ node }: RepoTreeViewProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder';

  return (
    <div className="pl-3.5 select-none font-mono text-[11px] text-zinc-700">
      <div
        className="flex items-center gap-1.5 py-1 px-1 rounded-md hover:bg-zinc-100 transition-all cursor-pointer"
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          <>
            <span className="text-zinc-400 shrink-0">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
            <span className="text-indigo-600 shrink-0">
              {isOpen ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
            </span>
          </>
        ) : (
          <>
            <span className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-500 shrink-0">
              <FileCode className="w-3.5 h-3.5" />
            </span>
          </>
        )}
        <span className={`${isFolder ? 'font-bold text-zinc-800' : 'text-zinc-600'}`}>{node.name}</span>
      </div>

      {isFolder && isOpen && node.children && (
        <div className="border-l border-zinc-200/80 ml-2.5 mt-0.5 flex flex-col">
          {node.children.map((child) => (
            <RepoTreeView key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
