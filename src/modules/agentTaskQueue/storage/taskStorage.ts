import { AgentTask } from '../logic/types';

const TASK_QUEUE_KEY = 'agent_autonomous_task_queue_v1';

const INITIAL_TASKS: AgentTask[] = [
  {
    id: 'task-001',
    title: 'Audit Keamanan OSV Ekosistem',
    description: 'Memeriksa kecocokan versi package dependensi dengan database kerentanan keamanan terbuka OSV.',
    category: 'security',
    status: 'running',
    priority: 'high',
    progress: 45,
    estimatedSeconds: 45,
    createdAt: new Date(Date.now() - 1000 * 30).toISOString(),
  },
  {
    id: 'task-002',
    title: 'Auto-Refactoring Render Hooks',
    description: 'Mengoptimalkan performa rendering di modul AI dengan menstabilkan dependensi pada hook useEffect.',
    category: 'refactoring',
    status: 'pending',
    priority: 'medium',
    progress: 0,
    estimatedSeconds: 120,
    createdAt: new Date(Date.now() - 1000 * 10).toISOString(),
  },
  {
    id: 'task-003',
    title: 'Uji Unit Regresi Modul Keamanan',
    description: 'Menjalankan suite pengujian unit (18 skenario uji) untuk modul otentikasi dan token penyimpanan.',
    category: 'testing',
    status: 'paused',
    priority: 'high',
    progress: 20,
    estimatedSeconds: 60,
    createdAt: new Date(Date.now() - 1000 * 120).toISOString(),
  },
  {
    id: 'task-004',
    title: 'Deploy Sandbox Review App',
    description: 'Menyediakan lingkungan pengujian sandbox pada container Cloud Run untuk peninjauan langsung.',
    category: 'deployment',
    status: 'pending',
    priority: 'low',
    progress: 0,
    estimatedSeconds: 300,
    createdAt: new Date().toISOString(),
  },
];

export function getStoredTasks(): AgentTask[] {
  try {
    const raw = localStorage.getItem(TASK_QUEUE_KEY);
    if (!raw) {
      localStorage.setItem(TASK_QUEUE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Module:agentTaskQueue] Error reading stored tasks:', err);
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: AgentTask[]): void {
  try {
    localStorage.setItem(TASK_QUEUE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('[Module:agentTaskQueue] Error saving tasks:', err);
  }
}

export function updateStoredTask(id: string, updates: Partial<AgentTask>): AgentTask[] {
  const current = getStoredTasks();
  const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
  saveStoredTasks(updated);
  return updated;
}
