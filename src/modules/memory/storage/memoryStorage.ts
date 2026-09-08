import { MemoryNote } from '../logic/types';

const MEMORY_STORAGE_KEY = 'agent_knowledge_memory_v1';

const DEFAULT_MEMORIES: MemoryNote[] = [
  {
    id: 'mem-sop-zero-mistake',
    category: 'tool_skill',
    title: 'SOP Zero Mistake Protocol',
    content: 'Aturan mutlak AI Agent: Read before write, ukuran file <125 baris, komunikasi via core/dispatcher, 100% strict type safety.',
    tags: ['SOP', 'Standard', 'Architecture'],
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'mem-tools-suite',
    category: 'tool_skill',
    title: 'Daftar Tools & Modul Aktif',
    content: 'Tersedia modul: Repo Explorer, Security Manifest Auditor, AI Peer Reviewer, Pre-commit Tester, Sentiment Analyzer, Analytics D3, Notification Center, Voice Live.',
    tags: ['Tools', 'Modules', 'Capabilities'],
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
  },
];

export const memoryStorage = {
  getMemories(): MemoryNote[] {
    try {
      const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (!raw) return DEFAULT_MEMORIES;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MEMORIES;
    } catch {
      return DEFAULT_MEMORIES;
    }
  },

  saveMemories(notes: MemoryNote[]): void {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('[Module:Memory] Error saving memories:', e);
    }
  },

  addMemory(note: Omit<MemoryNote, 'id' | 'createdAt' | 'updatedAt'>): MemoryNote {
    const memories = this.getMemories();
    const newNote: MemoryNote = {
      ...note,
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.saveMemories([newNote, ...memories]);
    return newNote;
  },

  deleteMemory(id: string): void {
    const filtered = this.getMemories().filter((m) => m.id !== id);
    this.saveMemories(filtered);
  },

  clearAll(): void {
    this.saveMemories([]);
  },
};
