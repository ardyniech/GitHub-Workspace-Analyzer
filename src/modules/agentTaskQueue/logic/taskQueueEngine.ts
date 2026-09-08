import { AgentTask, TaskQueueSummary, TaskStatus } from './types';
import { getStoredTasks, saveStoredTasks } from '../storage/taskStorage';
import { devConsoleLogger } from '../../devConsole';
import { dispatcher } from '../../../core/dispatcher';

export function getTaskQueueSummary(tasks: AgentTask[]): TaskQueueSummary {
  return {
    total: tasks.length,
    runningCount: tasks.filter((t) => t.status === 'running').length,
    pendingCount: tasks.filter((t) => t.status === 'pending').length,
    pausedCount: tasks.filter((t) => t.status === 'paused').length,
    completedCount: tasks.filter((t) => t.status === 'completed').length,
  };
}

export function reorderTask(taskId: string, direction: 'up' | 'down'): AgentTask[] {
  const tasks = getStoredTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return tasks;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= tasks.length) return tasks;

  // Swap
  const temp = tasks[index];
  tasks[index] = tasks[targetIndex];
  tasks[targetIndex] = temp;

  saveStoredTasks(tasks);
  devConsoleLogger.addLog('info', 'TaskQueue', `Urutan tugas diubah: "${temp.title}" dipindahkan ke ${direction}.`);
  dispatcher.emit('task_queue:updated', tasks);
  return tasks;
}

export function toggleTaskPause(taskId: string): AgentTask[] {
  const tasks = getStoredTasks();
  const updated = tasks.map((t) => {
    if (t.id === taskId) {
      const newStatus: TaskStatus = t.status === 'paused' ? 'pending' : 'paused';
      devConsoleLogger.addLog('info', 'TaskQueue', `Tugas "${t.title}" status diubah menjadi: ${newStatus}.`);
      return { ...t, status: newStatus };
    }
    return t;
  });

  saveStoredTasks(updated);
  dispatcher.emit('task_queue:updated', updated);
  return updated;
}

export function cancelTask(taskId: string): AgentTask[] {
  const tasks = getStoredTasks();
  const filtered = tasks.filter((t) => t.id !== taskId);

  saveStoredTasks(filtered);
  devConsoleLogger.addLog('info', 'TaskQueue', `Tugas dengan ID ${taskId} dibatalkan dari antrean.`);
  dispatcher.emit('task_queue:updated', filtered);
  return filtered;
}

export function addAutonomousTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'progress'>): AgentTask {
  const tasks = getStoredTasks();
  const newTask: AgentTask = {
    ...task,
    id: `task-custom-${Date.now()}`,
    progress: 0,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveStoredTasks(tasks);
  devConsoleLogger.addLog('info', 'TaskQueue', `Tugas otonom baru ditambahkan: "${task.title}".`);
  dispatcher.emit('task_queue:updated', tasks);
  return newTask;
}
