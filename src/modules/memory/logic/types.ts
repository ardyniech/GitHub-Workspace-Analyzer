export interface MemoryNote {
  id: string;
  category: 'repo_progress' | 'tool_skill' | 'conversation' | 'user_preference';
  title: string;
  content: string;
  repoFullName?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AgentKnowledgeSummary {
  totalNotes: number;
  knownRepos: string[];
  knownToolsAndSkills: string[];
  recentInsights: string[];
}
