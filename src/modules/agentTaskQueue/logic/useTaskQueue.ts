import { useState, useEffect } from 'react';
import { AgentTask, TaskQueueSummary } from './types';
import { getStoredTasks } from '../storage/taskStorage';
import { getTaskQueueSummary, reorderTask, toggleTaskPause, cancelTask, addAutonomousTask } from './taskQueueEngine';
import { executeTaskWithAgent, executeAllPendingTasks } from './taskExecutor';
import { dispatcher } from '../../../core/dispatcher';

export function useTaskQueue() {
  const [tasks, setTasks] = useState<AgentTask[]>(getStoredTasks());

  useEffect(() => {
    const unsub = dispatcher.on('task_queue:updated', (data: AgentTask[]) => {
      setTasks(data);
    });
    const unsubRun = dispatcher.on('agent_task:create_and_run', async (newTaskData: Omit<AgentTask, 'id' | 'createdAt' | 'progress'>) => {
      const added = addAutonomousTask(newTaskData);
      await executeTaskWithAgent(added.id);
    });
    return () => {
      unsub();
      unsubRun();
    };
  }, []);

  const summary = getTaskQueueSummary(tasks);

  return {
    tasks,
    summary,
    reorder: (id: string, direction: 'up' | 'down') => setTasks(reorderTask(id, direction)),
    togglePause: (id: string) => setTasks(toggleTaskPause(id)),
    cancel: (id: string) => setTasks(cancelTask(id)),
    executeTask: (id: string) => executeTaskWithAgent(id),
    executeAll: () => executeAllPendingTasks(),
    addTask: (task: Omit<AgentTask, 'id' | 'createdAt' | 'progress'>) => {
      const created = addAutonomousTask(task);
      setTasks(getStoredTasks());
      return created;
    },
    refresh: () => setTasks(getStoredTasks()),
  };
}
