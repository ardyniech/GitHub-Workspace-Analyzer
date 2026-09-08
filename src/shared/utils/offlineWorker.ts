import { devConsoleLogger } from '../../modules/devConsole';
import { dispatcher } from '../../core/dispatcher';

export interface OfflineAnalysisTask {
  id: string;
  repoFullName: string;
  taskTitle: string;
  payload: any;
  createdAt: string;
  status: 'queued' | 'syncing' | 'synced';
}

const OFFLINE_QUEUE_KEY = 'offline_ai_analysis_queue_v1';

export const offlineWorker = {
  // Add an AI-driven task to the offline queue
  queueTask(repoFullName: string, taskTitle: string, payload: any): OfflineAnalysisTask {
    const queue = this.getQueue();
    const newTask: OfflineAnalysisTask = {
      id: `offline-task-${Date.now()}`,
      repoFullName,
      taskTitle,
      payload,
      createdAt: new Date().toISOString(),
      status: 'queued',
    };

    queue.push(newTask);
    this.saveQueue(queue);

    devConsoleLogger.addLog(
      'info',
      'OfflineWorker',
      `Mode Luring (Offline): Tugas analisis "${taskTitle}" dimasukkan ke antrean lokal.`
    );
    dispatcher.emit('offline_worker:updated', queue);

    return newTask;
  },

  getQueue(): OfflineAnalysisTask[] {
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveQueue(queue: OfflineAnalysisTask[]): void {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn('[OfflineWorker] Failed to save queue:', e);
    }
  },

  // Simulates checking network, and if online, syncs the queue by posting them as Draft PRs
  async processSyncQueue(): Promise<void> {
    const queue = this.getQueue();
    const pending = queue.filter((t) => t.status === 'queued');

    if (pending.length === 0) return;

    devConsoleLogger.addLog(
      'info',
      'OfflineWorker',
      `Koneksi pulih! Memproses ${pending.length} tugas analisis terpending untuk didorong ke GitHub...`
    );

    // Simulate pushing drafts to GitHub
    for (const task of pending) {
      task.status = 'syncing';
      this.saveQueue(queue);
      dispatcher.emit('offline_worker:updated', queue);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      task.status = 'synced';
      devConsoleLogger.addLog(
        'info',
        'OfflineWorker',
        `Berhasil membuat Draft PR di GitHub untuk "${task.taskTitle}" pada repositori ${task.repoFullName}.`
      );
    }

    // Clear synced tasks from queue
    const remaining = this.getQueue().filter((t) => t.status !== 'synced');
    this.saveQueue(remaining);
    dispatcher.emit('offline_worker:updated', remaining);
  },

  // Manual Trigger for testing syncing
  triggerManualSync(): void {
    this.processSyncQueue().catch((err) => {
      console.error('[OfflineWorker] Sync failed:', err);
    });
  },
};
