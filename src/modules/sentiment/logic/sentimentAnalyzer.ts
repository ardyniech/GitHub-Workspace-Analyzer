import { IssueComment } from '../storage/commentApi';
import {
  POSITIVE_PATTERNS,
  POSITIVE_EMOJIS,
  CRITICAL_PATTERNS,
  CRITICAL_EMOJIS,
  INQUIRY_PATTERNS,
  INQUIRY_EMOJIS,
} from './sentimentKeywords';
import { DominantMood, CommentTone, SentimentResult } from './sentimentTypes';

export function analyzeSingleText(text: string): { mood: DominantMood; score: number } {
  const lower = text.toLowerCase();
  let pos = 0;
  let crit = 0;
  let inq = 0;

  POSITIVE_PATTERNS.forEach((p) => { if (lower.includes(p)) pos += 1.2; });
  POSITIVE_EMOJIS.forEach((e) => { if (text.includes(e)) pos += 2; });
  CRITICAL_PATTERNS.forEach((p) => { if (lower.includes(p)) crit += 1.5; });
  CRITICAL_EMOJIS.forEach((e) => { if (text.includes(e)) crit += 2; });
  INQUIRY_PATTERNS.forEach((p) => { if (lower.includes(p)) inq += 1; });
  INQUIRY_EMOJIS.forEach((e) => { if (text.includes(e)) inq += 1.5; });

  if (crit > pos && crit >= 1.5) {
    return { mood: 'critical', score: Math.max(-100, Math.round(-crit * 25)) };
  }
  if (pos > crit && pos >= 1.2) {
    return { mood: 'positive', score: Math.min(100, Math.round(pos * 25)) };
  }
  if (inq >= 1.5) return { mood: 'inquiry', score: 10 };
  return { mood: 'neutral', score: 0 };
}

export function analyzeIssueComments(comments: IssueComment[]): SentimentResult {
  if (!comments || comments.length === 0) {
    return {
      dominantMood: 'neutral',
      score: 0,
      label: 'Belum Ada Diskusi',
      emoji: '💬',
      summary: 'Belum ada komentar tim di issue ini. Jadilah yang pertama memberi masukan.',
      totalComments: 0,
      counts: { positive: 0, critical: 0, inquiry: 0, neutral: 0 },
      percentages: { positive: 0, critical: 0, neutral: 100 },
      commentTones: [],
    };
  }

  const counts = { positive: 0, critical: 0, inquiry: 0, neutral: 0 };
  let totalScore = 0;

  const commentTones: CommentTone[] = comments.map((c) => {
    const { mood, score } = analyzeSingleText(c.body || '');
    counts[mood] += 1;
    totalScore += score;
    const meta = {
      positive: { label: 'Positif', emoji: '😊' },
      critical: { label: 'Kendala', emoji: '⚠️' },
      inquiry: { label: 'Tanya/Ide', emoji: '🤔' },
      neutral: { label: 'Informatif', emoji: '📝' },
    }[mood];
    return { id: c.id, mood, score, label: meta.label, emoji: meta.emoji };
  });

  const total = comments.length;
  const posPct = Math.round((counts.positive / total) * 100);
  const critPct = Math.round((counts.critical / total) * 100);
  const neutralPct = Math.max(0, 100 - posPct - critPct);

  let dominantMood: DominantMood = 'neutral';
  let label = 'Diskusi Tenang';
  let emoji = '📝';
  let summary = 'Diskusi bersifat informatif dan pertukaran data teknis teratur.';

  if (counts.critical > counts.positive && counts.critical >= Math.ceil(total * 0.35)) {
    dominantMood = 'critical';
    label = 'Ada Kendala';
    emoji = '⚠️';
    summary = `Terdapat laporan kendala atau bug (${critPct}% komentar) yang perlu perhatian.`;
  } else if (counts.positive >= counts.critical && counts.positive >= Math.ceil(total * 0.35)) {
    dominantMood = 'positive';
    label = 'Positif & Solutif';
    emoji = '✨';
    summary = `Diskusi tim konstruktif, apresiatif, dan solutif (${posPct}% bernada positif).`;
  } else if (counts.inquiry >= Math.ceil(total * 0.35)) {
    dominantMood = 'inquiry';
    label = 'Diskusi Hangat';
    emoji = '💡';
    summary = 'Tim aktif bertukar ide, mengajukan pertanyaan, dan mencari solusi bersama.';
  }

  return {
    dominantMood,
    score: Math.round(totalScore / total),
    label,
    emoji,
    summary,
    totalComments: total,
    counts,
    percentages: { positive: posPct, critical: critPct, neutral: neutralPct },
    commentTones,
  };
}
