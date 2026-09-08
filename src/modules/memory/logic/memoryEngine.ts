import { memoryStorage } from '../storage/memoryStorage';
import { MemoryNote } from './types';

export function buildAgentMemoryContext(currentRepoFullName?: string): string {
  const allMemories = memoryStorage.getMemories();
  if (allMemories.length === 0) return '';

  // Filter memories: tools/skills, global prefs, and specific repo progress
  const relevant = allMemories.filter((m) => {
    if (m.category === 'tool_skill' || m.category === 'user_preference') return true;
    if (currentRepoFullName && m.repoFullName === currentRepoFullName) return true;
    return false;
  }).slice(0, 10);

  if (relevant.length === 0) return '';

  const memoryLines = relevant
    .map((m) => `- [${m.category.toUpperCase()} | ${m.title}]: ${m.content}`)
    .join('\n');

  return `
--- AGENT PERSISTENT MEMORY & KNOWLEDGE BASE ---
${memoryLines}
--- END AGENT MEMORY ---
`;
}

export function autoRecordRepoProgress(
  repoFullName: string,
  activityTitle: string,
  details: string
): MemoryNote {
  return memoryStorage.addMemory({
    category: 'repo_progress',
    title: `Progres: ${activityTitle}`,
    content: details,
    repoFullName,
    tags: [repoFullName.split('/')[1] || repoFullName, 'Progress', 'Automated'],
  });
}

export function autoRecordConversationSummary(
  repoFullName: string | undefined,
  topic: string,
  summary: string
): MemoryNote {
  return memoryStorage.addMemory({
    category: 'conversation',
    title: `Percakapan: ${topic}`,
    content: summary,
    repoFullName,
    tags: ['Conversation', 'Memory'],
  });
}
