import React, { useState, useEffect } from 'react';
import { repoApi, RepoContentItem } from '../storage/api';
import { ExplorerBreadcrumbs } from './ExplorerBreadcrumbs';
import { NewFileDialog } from './NewFileDialog';
import { useAuth } from '../../auth';
import { Folder, FileCode, Loader2 } from 'lucide-react';

interface RepoFileExplorerProps {
  repoFullName: string;
  onSelectFile: (path: string, isNew?: boolean) => void;
}

export function RepoFileExplorer({ repoFullName, onSelectFile }: RepoFileExplorerProps) {
  const { token } = useAuth();
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState<RepoContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    repoApi
      .fetchContents(repoFullName, currentPath, token)
      .then((data) => isMounted && setItems(data))
      .catch((err) => isMounted && setError(err.message || 'Gagal memuat berkas.'))
      .finally(() => isMounted && setLoading(false));

    return () => { isMounted = false; };
  }, [repoFullName, currentPath, token]);

  const handleNavigateUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.join('/'));
  };

  return (
    <div className="flex flex-col gap-2">
      <ExplorerBreadcrumbs
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        onNavigateUp={handleNavigateUp}
        onNewFile={() => setShowNewModal(true)}
      />

      <div className="max-h-[220px] overflow-y-auto flex flex-col gap-1 pr-1">
        {loading ? (
          <div className="flex items-center justify-center p-6 text-zinc-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Membaca berkas repositori...</span>
          </div>
        ) : error ? (
          <p className="text-xs text-red-500 p-3 bg-red-50 rounded-lg">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-zinc-400 text-center py-6">Direktori ini kosong.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.path}
              onClick={() => (item.type === 'dir' ? setCurrentPath(item.path) : onSelectFile(item.path, false))}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 cursor-pointer text-xs transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {item.type === 'dir' ? (
                  <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                )}
                <span className="font-medium text-zinc-800 truncate">{item.name}</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {item.type === 'dir' ? 'Folder' : item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'File'}
              </span>
            </div>
          ))
        )}
      </div>

      {showNewModal && (
        <NewFileDialog
          currentPath={currentPath}
          onConfirm={(fullPath) => {
            setShowNewModal(false);
            onSelectFile(fullPath, true);
          }}
          onCancel={() => setShowNewModal(false)}
        />
      )}
    </div>
  );
}
