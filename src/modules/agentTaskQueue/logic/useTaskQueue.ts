import { useState, useEffect } from 'react';
import { AgentTask, TaskQueueSummary } from './types';
import { getStoredTasks } from '../storage/taskStorage';
import { getTaskQueueSummary, reorderTask, toggleTaskPause, cancelTask, addAutonomousTask } from './taskQueueEngine';
import { dispatcher } from '../../../core/dispatcher';

export function useTaskQueue() {
  const [tasks, setTasks] = useState<AgentTask[]>(getStoredTasks());

  useEffect(() => {
    const unsub = dispatcher.on('task_queue:updated', (data: AgentTask[]) => {
      setTasks(data);
    });
    return () => unsub();
  }, []);

  const summary = getTaskQueueSummary(tasks);

  return {
    tasks,
    summary,
    reorder: (id: string, direction: 'up' | 'down') => setTasks(reorderTask(id, direction)),
    togglePause: (id: string) => setTasks(toggleTaskPause(id)),
    cancel: (id: string) => setTasks(cancelTask(id)),
    addTask: (task: Omit<AgentTask, 'id' | 'createdAt' | 'progress'>) => {
      addAutonomousTask(task);
      setTasks(getStoredTasks());
    },
    refresh: () => setTasks(getStoredTasks()),
  };
}
