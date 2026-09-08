export interface IssuePriorityItem {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  urgency: number; // 1 (Rendah) - 10 (Kritis)
  impact: number;  // 1 (Kecil) - 10 (Masif)
  quadrant: 'Quick Wins' | 'Major Projects' | 'Fill-ins' | 'Thankless Tasks';
  labels: string[];
  author: string;
}

export interface PriorityMatrixSummary {
  quickWins: number;
  majorProjects: number;
  fillIns: number;
  thanklessTasks: number;
  items: IssuePriorityItem[];
}
