import { useState, useEffect } from 'react';
import { dispatcher } from '../../../core/dispatcher';
import { memoryStorage } from '../storage/memoryStorage';
import { autoRecordRepoProgress, autoRecordConversationSummary } from './memoryEngine';
import { MemoryNote } from './types';

export function useAgentMemory(currentRepoFullName?: string) {
  const [memories, setMemories] = useState<MemoryNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const refreshMemories = () => {
    setMemories(memoryStorage.getMemories());
  };

  useEffect(() => {
    refreshMemories();

    // Listen to repo and AI events to auto-memorize progress
    const unsubCommit = dispatcher.on('repo:commit_pushed', (data: { repoFullName: string; filePath: string }) => {
      if (data?.repoFullName) {
        autoRecordRepoProgress(
          data.repoFullName,
          `Commit berkas ${data.filePath}`,
          `Pengguna/Agent berhasil melakukan commit dan push ke ${data.filePath} pada repositori ${data.repoFullName}.`
        );
        refreshMemories();
      }
    });

    const unsubSaveMem = dispatcher.on('memory:save', (data: { category: any; title: string; content: string; repoFullName?: string; tags?: string[] }) => {
      if (data?.title && data?.content) {
        memoryStorage.addMemory({
          category: data.category || 'tool_skill',
          title: data.title,
          content: data.content,
          repoFullName: data.repoFullName || currentRepoFullName,
          tags: data.tags || ['Custom'],
        });
        refreshMemories();
        dispatcher.emit('notify:push', {
          type: 'success',
          title: 'Memori Disimpan',
          message: `Insight "${data.title}" berhasil dicatat ke memori permanen agent.`,
        });
      }
    });

    return () => {
      unsubCommit();
      unsubSaveMem();
    };
  }, [currentRepoFullName]);

  const addManualMemory = (note: Omit<MemoryNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = memoryStorage.addMemory(note);
    refreshMemories();
    return created;
  };

  const deleteMemory = (id: string) => {
    memoryStorage.deleteMemory(id);
    refreshMemories();
  };

  const clearAll = () => {
    memoryStorage.clearAll();
    refreshMemories();
  };

  const filteredMemories = memories.filter((m) => {
    const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return {
    memories: filteredMemories,
    totalCount: memories.length,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    addManualMemory,
    deleteMemory,
    clearAll,
    refreshMemories,
  };
}
