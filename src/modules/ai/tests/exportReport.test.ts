import { generateReportMarkdown, ChatMessage } from '../logic/exportReport';

export function runExportReportTests(): boolean {
  console.log('[Module:AI] Running Export Report Unit Tests...');

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'user',
      text: 'Bagaimana cara memperbaiki celah keamanan di modul auth?',
    },
    {
      id: '2',
      sender: 'assistant',
      text: 'Gunakan environment variable untuk token dan hindari hardcoding kredensial.',
    },
  ];

  const report = generateReportMarkdown({
    repoFullName: 'octocat/Hello-World',
    activeModel: 'gemini-3.8-flash',
    messages: mockMessages,
  });

  if (!report.includes('# Laporan Analisis Repositori AI')) {
    console.error('[Module:AI] Test 1 Failed: Missing title in report');
    return false;
  }
  console.log('[Module:AI] Test 1 Passed: Title correctly rendered');

  if (!report.includes('octocat/Hello-World')) {
    console.error('[Module:AI] Test 2 Failed: Missing repo name in report');
    return false;
  }
  console.log('[Module:AI] Test 2 Passed: Repo name included');

  if (!report.includes('Bagaimana cara memperbaiki celah keamanan')) {
    console.error('[Module:AI] Test 3 Failed: User question not included');
    return false;
  }
  console.log('[Module:AI] Test 3 Passed: User conversation included');

  if (!report.includes('Rencana Tindak Lanjut Tim')) {
    console.error('[Module:AI] Test 4 Failed: Action items checklist missing');
    return false;
  }
  console.log('[Module:AI] Test 4 Passed: Team action items checklist present');

  return true;
}
