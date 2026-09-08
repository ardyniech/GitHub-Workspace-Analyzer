import { PreFlightState } from '../logic/types';

const STORAGE_KEY = 'agent_pr_pre_flight_state_v1';

const INITIAL_STATE: PreFlightState = {
  status: 'pending',
  commitHash: 'fea32bc9df7643e2a0918fa2bf9cf9',
  commitMessage: 'feat(auth): integrate dynamic auth verification & dispatch events',
  score: 0,
  filesReviewed: [
    { filePath: 'src/modules/auth/logic/authEngine.ts', linesChanged: 42, status: 'warning', issuesCount: 1 },
    { filePath: 'src/modules/auth/primitives/LoginForm.tsx', linesChanged: 84, status: 'passed', issuesCount: 0 },
    { filePath: 'src/modules/auth/storage/authStorage.ts', linesChanged: 110, status: 'failed', issuesCount: 2 },
  ],
  issues: [
    {
      id: 'issue-1',
      filePath: 'src/modules/auth/logic/authEngine.ts',
      ruleId: 'ARCH-101',
      ruleName: 'Modular Communication Violation',
      severity: 'architectural',
      message: 'Impor langsung dari modules/notification/storage secara bypass. Melanggar prinsip lego-cellular.',
      proposedFix: 'Gunakan dispatcher.emit("notification:send", { ... }) untuk berkomunikasi antar modul secara terisolasi.',
    },
    {
      id: 'issue-2',
      filePath: 'src/modules/auth/storage/authStorage.ts',
      ruleId: 'SEC-402',
      ruleName: 'Sensitive Token Exposure Risk',
      severity: 'critical',
      message: 'Ditemukan penyimpanan raw token JWT langsung pada localStorage tanpa enkripsi.',
      proposedFix: 'Bungkus nilai token dengan enkripsi AES ringan sebelum disimpan, atau simpan di memori aman (Secure Session Token).',
    },
    {
      id: 'issue-3',
      filePath: 'src/modules/auth/storage/authStorage.ts',
      ruleId: 'BUG-305',
      ruleName: 'Unhandled Uncaught Rejections',
      severity: 'warning',
      message: 'Fungsi asynchronous getSessionInfo tidak dibungkus dengan try/catch block.',
      proposedFix: 'Bungkus seluruh tubuh fungsi asinkron dengan try/catch terstandar untuk menangkap kegagalan parsing JSON.',
    },
  ],
  startedAt: new Date().toISOString(),
};

export function getStoredPreFlightState(): PreFlightState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
      return INITIAL_STATE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Module:prPreFlight] Error reading stored state:', err);
    return INITIAL_STATE;
  }
}

export function saveStoredPreFlightState(state: PreFlightState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[Module:prPreFlight] Error saving state:', err);
  }
}
