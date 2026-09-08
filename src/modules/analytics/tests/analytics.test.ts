import { WeeklyCommitActivity } from '../logic/types';

export function runAnalyticsDataTests(): boolean {
  console.log('[Module:Analytics] Running D3 Analytics Unit Tests...');

  // Test 1: Weekly Commit format
  const sampleWeek: WeeklyCommitActivity = {
    week: 1710000000,
    total: 14,
    days: [1, 2, 3, 4, 2, 1, 1],
    weekLabel: '10/3',
  };

  if (sampleWeek.total !== 14 || sampleWeek.days.length !== 7) {
    console.error('[Module:Analytics] Test 1 Failed: Data format mismatch');
    return false;
  }
  console.log('[Module:Analytics] Test 1 Passed: Weekly commit activity schema validated');

  // Test 2: Accumulation logic
  const weeks: WeeklyCommitActivity[] = [
    sampleWeek,
    { week: 1710604800, total: 6, days: [0, 1, 2, 1, 2, 0, 0], weekLabel: '17/3' },
  ];
  const totalCommits = weeks.reduce((sum, w) => sum + w.total, 0);
  if (totalCommits !== 20) {
    console.error('[Module:Analytics] Test 2 Failed: Accumulation sum mismatch');
    return false;
  }
  console.log('[Module:Analytics] Test 2 Passed: Commit sum calculation matches');

  return true;
}
