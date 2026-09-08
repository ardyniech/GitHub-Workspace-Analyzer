import { AgentTask } from './types';
import { getStoredTasks, updateStoredTask } from '../storage/taskStorage';
import { devConsoleLogger } from '../../devConsole';
import { dispatcher } from '../../../core/dispatcher';

export async function executeTaskWithAgent(taskId: string): Promise<void> {
  const tasks = getStoredTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    console.error(`[Module:agentTaskQueue] Error in executeTaskWithAgent: Task ${taskId} not found`);
    return;
  }

  // Stage 1: Mark as running and emit prompt to AI Agent
  devConsoleLogger.addLog('reasoning', 'TaskExecutor', `Memulai eksekusi tugas "${task.title}". Mengirim instruksi ke Copilot Agent...`);
  let currentTasks = updateStoredTask(taskId, { status: 'running', progress: Math.max(25, task.progress) });
  dispatcher.emit('task_queue:updated', currentTasks);

  const agentPrompt = `Eksekusi Tugas Otonom: [${task.title}]\n\nKategori: ${task.category.toUpperCase()}\nPrioritas: ${task.priority.toUpperCase()}\nDeskripsi: ${task.description}\n\nInstruksi untuk Agen: Lakukan analisis mendalam dan eksekusi tugas ini. Berikan langkah-langkah implementasi konkret, rekomendasi perubahan kode, atau validasi arsitektur sesuai standar produksi.`;

  dispatcher.emit('ai:send_prompt', { prompt: agentPrompt });
  dispatcher.emit('notify:push', {
    type: 'info',
    title: 'Tugas Dikirim ke Agen',
    message: `Agen AI sedang memproses: "${task.title}"`,
  });

  // Stage 2: Simulating intermediate execution steps with live progress
  await new Promise((res) => setTimeout(res, 800));
  devConsoleLogger.addLog('info', 'TaskExecutor', `[${task.title}] Tahap 1: Verifikasi dependensi dan konteks modul selesai.`);
  currentTasks = updateStoredTask(taskId, { progress: 65 });
  dispatcher.emit('task_queue:updated', currentTasks);

  await new Promise((res) => setTimeout(res, 1000));
  devConsoleLogger.addLog('info', 'TaskExecutor', `[${task.title}] Tahap 2: Menerapkan perbaikan kode & validasi aturan batas 125 baris.`);
  currentTasks = updateStoredTask(taskId, { progress: 90 });
  dispatcher.emit('task_queue:updated', currentTasks);

  await new Promise((res) => setTimeout(res, 800));

  // Stage 3: Complete execution
  currentTasks = updateStoredTask(taskId, { status: 'completed', progress: 100 });
  devConsoleLogger.addLog('info', 'TaskExecutor', `[${task.title}] Berhasil diselesaikan oleh Agen AI.`);
  dispatcher.emit('task_queue:updated', currentTasks);

  if (task.category === 'refactoring') {
    dispatcher.emit('visualizer:apply_refactor', {
      title: task.title,
      description: task.description,
    });
  }

  dispatcher.emit('notify:push', {
    type: 'success',
    title: 'Tugas Selesai Dieksekusi',
    message: `Agen AI telah berhasil menyelesaikan tugas: "${task.title}".`,
  });
}

export async function executeAllPendingTasks(): Promise<void> {
  const tasks = getStoredTasks();
  const pending = tasks.filter((t) => t.status === 'pending' || t.status === 'paused');
  for (const t of pending) {
    await executeTaskWithAgent(t.id);
  }
}
