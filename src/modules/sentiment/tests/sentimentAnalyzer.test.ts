import { analyzeIssueComments, analyzeSingleText } from '../logic/sentimentAnalyzer';
import { IssueComment } from '../storage/commentApi';

export function runSentimentAnalyzerTests(): boolean {
  let passed = true;
  const assert = (cond: boolean, name: string) => {
    if (!cond) {
      console.error(`[Module:sentiment] Test failed: ${name}`);
      passed = false;
    } else {
      console.log(`[Module:sentiment] Test passed: ${name}`);
    }
  };

  try {
    // 1. Single text test positive
    const pos = analyzeSingleText('Terima kasih banyak atas solusinya, mantap dan sudah fix! 🚀');
    assert(pos.mood === 'positive', 'Single positive text should detect positive mood');
    assert(pos.score > 0, 'Positive score should be greater than 0');

    // 2. Single text test critical
    const crit = analyzeSingleText('Aplikasi crash lagi dan error terus saat submit 🛑');
    assert(crit.mood === 'critical', 'Critical text should detect critical mood');
    assert(crit.score < 0, 'Critical score should be negative');

    // 3. Issue comments positive discussion
    const mockCommentsPos: IssueComment[] = [
      {
        id: 1,
        body: 'Solusi ini berhasil dan berjalan dengan baik. Terima kasih tim! 👍',
        created_at: new Date().toISOString(),
        html_url: 'https://github.com/issue/1#1',
        user: { login: 'alice', avatar_url: '' },
      },
      {
        id: 2,
        body: 'Setuju, sudah saya tes dan fix semua. Keren! 🎉',
        created_at: new Date().toISOString(),
        html_url: 'https://github.com/issue/1#2',
        user: { login: 'bob', avatar_url: '' },
      },
    ];
    const resPos = analyzeIssueComments(mockCommentsPos);
    assert(resPos.dominantMood === 'positive', 'Discussion should be dominant positive');
    assert(resPos.counts.positive === 2, 'Should count 2 positive comments');
    assert(resPos.percentages.positive === 100, 'Should be 100% positive');

    // 4. Issue comments critical discussion
    const mockCommentsCrit: IssueComment[] = [
      {
        id: 3,
        body: 'Server down dan ada fatal error di database ❌',
        created_at: new Date().toISOString(),
        html_url: 'https://github.com/issue/2#3',
        user: { login: 'charlie', avatar_url: '' },
      },
      {
        id: 4,
        body: 'Ini bug kritis dan blocking release hari ini!',
        created_at: new Date().toISOString(),
        html_url: 'https://github.com/issue/2#4',
        user: { login: 'dave', avatar_url: '' },
      },
    ];
    const resCrit = analyzeIssueComments(mockCommentsCrit);
    assert(resCrit.dominantMood === 'critical', 'Discussion should be dominant critical');
    assert(resCrit.percentages.critical === 100, 'Should be 100% critical');

    // 5. Empty comments fallback
    const resEmpty = analyzeIssueComments([]);
    assert(resEmpty.dominantMood === 'neutral', 'Empty discussion should be neutral');
    assert(resEmpty.totalComments === 0, 'Total comments should be 0');
  } catch (err: any) {
    console.error(`[Module:sentiment] Error in runSentimentAnalyzerTests: ${err.message || err}`);
    return false;
  }

  return passed;
}
