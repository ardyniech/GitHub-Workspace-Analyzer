export type DominantMood = 'positive' | 'critical' | 'inquiry' | 'neutral';

export interface CommentTone {
  id: number;
  mood: DominantMood;
  score: number;
  label: string;
  emoji: string;
}

export interface SentimentCounts {
  positive: number;
  critical: number;
  inquiry: number;
  neutral: number;
}

export interface SentimentPercentages {
  positive: number;
  critical: number;
  neutral: number;
}

export interface SentimentResult {
  dominantMood: DominantMood;
  score: number; // -100 to +100
  label: string;
  emoji: string;
  summary: string;
  totalComments: number;
  counts: SentimentCounts;
  percentages: SentimentPercentages;
  commentTones: CommentTone[];
}
