import { PreCommitTestItem } from './types';

export function testSanityAndEmpty(files: Array<{ path: string; content: string }>): PreCommitTestItem {
  const emptyFiles = files.filter((f) => !f.content || f.content.trim().length === 0).map((f) => f.path);
  return {
    id: 'test-sanity',
    name: '1. Uji Kelayakan & Isi Berkas',
    description: 'Memastikan tidak ada berkas kosong atau tidak bermuatan.',
    passed: emptyFiles.length === 0,
    severity: 'error',
    message: emptyFiles.length === 0 ? 'Semua berkas memiliki isi yang lengkap.' : `Berkas kosong terdeteksi: ${emptyFiles.join(', ')}`,
    failedFiles: emptyFiles,
  };
}

export function testPlaceholderAndIncomplete(files: Array<{ path: string; content: string }>): PreCommitTestItem {
  const placeholderRegex = /(TODO:\s*implement|\/\/\s*\.\.\.existing\s*code|\.\.\.rest\s*of\s*code|<INSERT\s*CODE>|throw\s*new\s*Error\(['"]Not implemented['"]\))/i;
  const placeholderFiles = files.filter((f) => placeholderRegex.test(f.content)).map((f) => f.path);
  return {
    id: 'test-placeholder',
    name: '2. Uji Kelengkapan Kode (Anti-Placeholder)',
    description: 'Memastikan tidak ada komentar potongan TODO atau kode yang belum selesai.',
    passed: placeholderFiles.length === 0,
    severity: 'warning',
    message: placeholderFiles.length === 0 ? 'Kode 100% lengkap dan siap dijalankan.' : `Placeholder ditemukan di: ${placeholderFiles.join(', ')}`,
    failedFiles: placeholderFiles,
  };
}

export function testSyntaxAndBrackets(files: Array<{ path: string; content: string }>): PreCommitTestItem {
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
  return {
    id: 'test-syntax',
    name: '3. Uji Integritas Sintaks & Tanda Kurung',
    description: 'Memeriksa keseimbangan kurawal, bracket, dan parse validitas JSON.',
    passed: syntaxErrors.length === 0,
    severity: 'error',
    message: syntaxErrors.length === 0 ? 'Struktur sintaks dan kurung valid seimbang.' : `Kesalahan sintaks: ${syntaxErrors.join('; ')}`,
    failedFiles: syntaxErrors,
  };
}
