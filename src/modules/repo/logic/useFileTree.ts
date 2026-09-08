import { useState, useCallback, useEffect } from 'react';
import { fileApi, RepoContentItem } from '../storage/fileApi';
import { dispatcher } from '../../../core/dispatcher';

export function useFileTree(repoFullName: string, token: string, branch?: string) {
  const [items, setItems] = useState<RepoContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState('');

  const load = useCallback(async (targetPath: string) => {
    setLoading(true);
    try {
      const data = await fileApi.fetchContents(repoFullName, targetPath, token);
      setItems(data);
      setPath(targetPath);
    } catch (err: any) {
      dispatcher.emit('notify:push', { type: 'error', title: 'Gagal Muat', message: err.message });
    } finally {
      setLoading(false);
    }
  }, [repoFullName, token]);

  useEffect(() => { if (repoFullName && token) load(''); }, [repoFullName, token, load]);

  const createItem = async (name: string, content: string) => {
    const fullPath = path ? `${path}/${name}` : name;
    await fileApi.commitFile(repoFullName, fullPath, content, `Create ${fullPath}`, token, undefined, branch);
    await load(path);
  };

  const deleteItem = async (item: RepoContentItem) => {
    await fileApi.deleteFile(repoFullName, item.path, `Delete ${item.path}`, token, item.sha, branch);
    await load(path);
  };

  const renameItem = async (item: RepoContentItem, newName: string) => {
    const newPath = path ? `${path}/${newName}` : newName;
    const { content } = await fileApi.fetchFileContent(repoFullName, item.path, token, branch);
    await fileApi.commitFile(repoFullName, newPath, content, `Rename ${item.path} to ${newPath}`, token, undefined, branch);
    await fileApi.deleteFile(repoFullName, item.path, `Clean up old file ${item.path}`, token, item.sha, branch);
    await load(path);
  };

  const deleteMultiple = async (itemsToDelete: RepoContentItem[]) => {
    for (const item of itemsToDelete) {
      await fileApi.deleteFile(repoFullName, item.path, `Batch delete ${item.path}`, token, item.sha, branch);
    }
    await load(path);
  };

  const moveMultiple = async (itemsToMove: RepoContentItem[], targetDir: string) => {
    for (const item of itemsToMove) {
      const newPath = targetDir ? `${targetDir}/${item.name}` : item.name;
      const { content } = await fileApi.fetchFileContent(repoFullName, item.path, token, branch);
      await fileApi.commitFile(repoFullName, newPath, content, `Move ${item.path} to ${newPath}`, token, undefined, branch);
      await fileApi.deleteFile(repoFullName, item.path, `Clean up ${item.path}`, token, item.sha, branch);
    }
    await load(path);
  };

  return { items, loading, path, load, createItem, deleteItem, renameItem, deleteMultiple, moveMultiple };
}
