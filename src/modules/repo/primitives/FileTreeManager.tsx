import React, { useState } from 'react';
import { useFileTree } from '../logic/useFileTree';
import { Button } from '../../../shared/atoms/Button';
import { useAuth } from '../../auth';
import { Folder, File, Trash, Edit, Plus, ChevronLeft, CheckSquare, Square, MoveRight } from 'lucide-react';
import { dispatcher } from '../../../core/dispatcher';

export function FileTreeManager({ repoFullName, branch }: { repoFullName: string, branch?: string }) {
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { items, loading, path, load, createItem, deleteItem, renameItem, deleteMultiple, moveMultiple } = useFileTree(repoFullName, token || '', branch);

  const wrapAction = async (msg: string, action: () => Promise<void>) => {
    setProcessing(true);
    try { await action(); dispatcher.emit('notify:push', { type: 'success', title: 'Sukses', message: msg }); setSelected(new Set()); }
    catch (err: any) { dispatcher.emit('notify:push', { type: 'error', title: 'Gagal', message: err.message }); }
    finally { setProcessing(false); }
  };

  const navTo = (newPath: string) => { setSelected(new Set()); load(newPath); };
  const handleBack = () => { const p = path.split('/'); p.pop(); navTo(p.join('/')); };
  
  const handleCreate = () => {
    const name = prompt('Nama file baru (beserta ekstensi):');
    if (!name) return;
    const content = prompt('Isi file awal:', '// new file');
    if (content !== null) wrapAction('File dibuat', () => createItem(name, content));
  };
  
  const handleRename = (item: any) => {
    const name = prompt('Nama baru:', item.name);
    if (name && name !== item.name) wrapAction('Diubah', () => renameItem(item, name));
  };
  
  const handleDelete = (item: any) => {
    if (confirm(`Hapus ${item.name}?`)) wrapAction('Dihapus', () => deleteItem(item));
  };

  const getSelectedItems = () => items.filter(i => selected.has(i.sha) && i.type === 'file');
  
  const handleBatchDelete = () => {
    if (confirm(`Hapus ${selected.size} berkas terpilih?`)) wrapAction('Batch dihapus', () => deleteMultiple(getSelectedItems()));
  };

  const handleBatchMove = () => {
    const target = prompt('Pindahkan ke direktori target (kosongkan untuk Root):', path);
    if (target !== null) wrapAction('Batch dipindah', () => moveMultiple(getSelectedItems(), target));
  };

  const toggleSelect = (sha: string) => {
    const next = new Set(selected);
    next.has(sha) ? next.delete(sha) : next.add(sha);
    setSelected(next);
  };

  if (!token) return <div className="p-4 text-sm text-zinc-500">Hubungkan GitHub terlebih dahulu.</div>;
  const isBusy = loading || processing;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300">
       <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
         <div className="flex items-center gap-2">
            {path && <Button size="sm" variant="ghost" onClick={handleBack} icon={<ChevronLeft className="w-4 h-4"/>} disabled={isBusy} />}
            <span className="font-mono text-xs">{path || '/ (Root)'}</span>
         </div>
         <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <>
                <Button size="sm" variant="ghost" onClick={handleBatchMove} icon={<MoveRight className="w-4 h-4"/>} disabled={isBusy} />
                <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-950/30" onClick={handleBatchDelete} icon={<Trash className="w-4 h-4"/>} disabled={isBusy} />
              </>
            )}
            <Button size="sm" onClick={handleCreate} icon={<Plus className="w-4 h-4"/>} disabled={isBusy}>Buat File</Button>
         </div>
       </div>
       
       {isBusy && <div className="text-xs text-emerald-400 mb-2 animate-pulse">Memproses...</div>}
       <div className="space-y-1">
          {items.length === 0 && !isBusy && <div className="text-xs text-zinc-500 italic">Direktori kosong</div>}
          {items.map(item => (
             <div key={item.sha} className="flex justify-between items-center p-2 hover:bg-zinc-900 rounded group transition-colors">
                <div className="flex items-center gap-2">
                  {item.type === 'file' ? (
                    <button onClick={() => toggleSelect(item.sha)} className="text-zinc-500 hover:text-white mt-0.5" disabled={isBusy}>
                      {selected.has(item.sha) ? <CheckSquare className="w-4 h-4 text-blue-500"/> : <Square className="w-4 h-4"/>}
                    </button>
                  ) : (
                    <div className="w-4 h-4" /> // placeholder
                  )}
                  <div className={`flex items-center gap-2 ${item.type === 'dir' ? 'cursor-pointer hover:text-blue-400' : ''}`}
                    onClick={() => item.type === 'dir' && !isBusy && navTo(item.path)}>
                    {item.type === 'dir' ? <Folder className="w-4 h-4 text-blue-500"/> : <File className="w-4 h-4 text-zinc-400"/>}
                    <span className="text-sm font-mono">{item.name}</span>
                  </div>
                </div>
                {item.type === 'file' && !selected.has(item.sha) && (
                   <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => handleRename(item)} icon={<Edit className="w-3.5 h-3.5"/>} disabled={isBusy} />
                      <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-950/30" onClick={() => handleDelete(item)} icon={<Trash className="w-3.5 h-3.5"/>} disabled={isBusy} />
                   </div>
                )}
             </div>
          ))}
       </div>
    </div>
  );
}
