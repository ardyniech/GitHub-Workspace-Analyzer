import { LinterIssue } from '../logic/types';

const LINTER_ISSUES_KEY = 'agent_proactive_linter_issues_v1';

const INITIAL_FALLBACK_ISSUES: LinterIssue[] = [
  {
    id: 'lint-perf-001',
    file: 'src/modules/ai/logic/useAi.ts',
    line: 42,
    category: 'performance',
    severity: 'high',
    ruleId: 'PERF_UNMEMOIZED_EFFECT_DEP',
    message: 'Potensi re-render tidak perlu: Objek/array dependensi useEffect di-instansiasi ulang pada setiap render.',
    suggestion: 'Bungkus objek dependensi dengan useMemo atau ekstrak sebagai konstanta di luar komponen.',
    snippet: 'useEffect(() => { ... }, [{ repo, options }])',
    autoFixable: true,
    detectedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: 'open',
  },
  {
    id: 'lint-sec-002',
    file: 'src/modules/auth/storage/authStorage.ts',
    line: 18,
    category: 'security',
    severity: 'critical',
    ruleId: 'SEC_UNENCRYPTED_LOCALSTORAGE_TOKEN',
    message: 'Potensi kebocoran kredensial: OAuth bearer token disimpan dalam plain-text LocalStorage.',
    suggestion: 'Pastikan token hanya ditransmisikan via header OIDC Authorization Oauth yang aman.',
    snippet: 'localStorage.setItem("github_token", rawToken)',
    autoFixable: false,
    detectedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'open',
  },
  {
    id: 'lint-perf-003',
    file: 'src/shared/atoms/Button.tsx',
    line: 28,
    category: 'performance',
    severity: 'medium',
    ruleId: 'PERF_INLINE_LAMBDA_HANDLER',
    message: 'Alokasi fungsi terpisah pada callback event handler UI.',
    suggestion: 'Gunakan useCallback untuk menstabilkan fungsi handler pada komponen atom.',
    snippet: 'onClick={() => handleClick(id)}',
    autoFixable: true,
    detectedAt: new Date(Date.now() - 1000 * 3600).toISOString(),
    status: 'open',
  },
];

export function getStoredLinterIssues(): LinterIssue[] {
  try {
    const raw = localStorage.getItem(LINTER_ISSUES_KEY);
    if (!raw) {
      localStorage.setItem(LINTER_ISSUES_KEY, JSON.stringify(INITIAL_FALLBACK_ISSUES));
      return INITIAL_FALLBACK_ISSUES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Module:proactiveLinter] Error reading stored linter issues:', err);
    return INITIAL_FALLBACK_ISSUES;
  }
}

export function saveStoredLinterIssues(issues: LinterIssue[]): void {
  try {
    localStorage.setItem(LINTER_ISSUES_KEY, JSON.stringify(issues));
  } catch (err) {
    console.error('[Module:proactiveLinter] Error saving linter issues:', err);
  }
}
