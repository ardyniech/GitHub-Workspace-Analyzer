export interface PreCommitTestItem {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  severity: 'error' | 'warning';
  message?: string;
  failedFiles?: string[];
}

export interface PreCommitReport {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  items: PreCommitTestItem[];
  durationMs: number;
}

export function runPreCommitTests(files: Array<{ path: string; content: string }>): PreCommitReport {
  const start = performance.now();
  const items: PreCommitTestItem[] = [];

  // Test 1: Sanity & Empty File Check
  const emptyFiles = files.filter((f) => !f.content || f.content.trim().length === 0).map((f) => f.path);
  items.push({
    id: 'test-sanity',
    name: 'Uji Kelayakan & Isi Berkas',
    description: 'Memastikan berkas tidak kosong dan memiliki konten yang valid.',
    passed: emptyFiles.length === 0,
    severity: 'error',
    message: emptyFiles.length === 0 ? 'Semua berkas memiliki isi yang lengkap.' : `Berkas kosong terdeteksi: ${emptyFiles.join(', ')}`,
    failedFiles: emptyFiles,
  });

  // Test 2: Placeholder & Unimplemented Code Check
  const placeholderRegex = /(TODO:\s*implement|\/\/\s*\.\.\.existing\s*code|\.\.\.rest\s*of\s*code|<INSERT\s*CODE>|throw\s*new\s*Error\(['"]Not implemented['"]\))/i;
  const placeholderFiles = files.filter((f) => placeholderRegex.test(f.content)).map((f) => f.path);
  items.push({
    id: 'test-placeholder',
    name: 'Uji Kelengkapan Kode (Bebas Placeholder)',
    description: 'Memastikan tidak ada komentar potongan TODO atau kode yang belum selesai.',
    passed: placeholderFiles.length === 0,
    severity: 'warning',
    message: placeholderFiles.length === 0 ? 'Kode lengkap, tidak ada placeholder yang tertinggal.' : `Placeholder ditemukan di: ${placeholderFiles.join(', ')}`,
    failedFiles: placeholderFiles,
  });

  // Test 3: Bracket & Syntax Integrity Check
  const syntaxErrors: string[] = [];
  for (const f of files) {
    if (f.path.endsWith('.json')) {
      try {
        JSON.parse(f.content);
      } catch {
        syntaxErrors.push(`${f.path} (Format JSON tidak valid)`);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(f.path)) {
      const counts: Record<string, number> = { '(': 0, '{': 0, '[': 0 };
      for (const char of f.content) {
        if (char === '(') counts['(']++;
        else if (char === ')') counts['(']--;
        else if (char === '{') counts['{']++;
        else if (char === '}') counts['{']--;
        else if (char === '[') counts['[']++;
        else if (char === ']') counts['[']--;
      }
      if (counts['('] !== 0 || counts['{'] !== 0 || counts['['] !== 0) {
        syntaxErrors.push(`${f.path} (Tanda kurung/kurawal tidak seimbang)`);
      }
    }
  }
  items.push({
    id: 'test-syntax',
    name: 'Uji Integritas Sintaks & Tanda Kurung',
    description: 'Memeriksa keseimbangan tanda kurung, kurawal, dan struktur berkas.',
    passed: syntaxErrors.length === 0,
    severity: 'error',
    message: syntaxErrors.length === 0 ? 'Sintaks dan struktur berkas valid.' : `Masalah sintaks pada: ${syntaxErrors.join('; ')}`,
    failedFiles: syntaxErrors,
  });

  // Test 4: Secret & Credential Leak Check
  const secretRegex = /(ghp_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}|(?:AIzaSy)[a-zA-Z0-9_-]{33}|(?:sk-[a-zA-Z0-9]{20,})|-----BEGIN (?:RSA )?PRIVATE KEY-----)/;
  const leakFiles = files.filter((f) => secretRegex.test(f.content)).map((f) => f.path);
  items.push({
    id: 'test-secrets',
    name: 'Uji Keamanan & Kebocoran Kunci Rahasia',
    description: 'Memastikan tidak ada API Key, Private Key, atau token rahasia yang bocor.',
    passed: leakFiles.length === 0,
    severity: 'error',
    message: leakFiles.length === 0 ? 'Tidak ada kunci rahasia atau token terbuka terdeteksi.' : `Kunci rahasia terdeteksi di: ${leakFiles.join(', ')}`,
    failedFiles: leakFiles,
  });

  const passedCount = items.filter((i) => i.passed).length;
  const criticalFails = items.filter((i) => !i.passed && i.severity === 'error').length;

  return {
    passed: criticalFails === 0,
    totalTests: items.length,
    passedTests: passedCount,
    failedTests: items.length - passedCount,
    items,
    durationMs: Math.round(performance.now() - start),
  };
}
