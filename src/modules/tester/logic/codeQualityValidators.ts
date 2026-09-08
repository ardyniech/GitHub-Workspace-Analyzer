import { PreCommitTestItem } from './types';

export function testSecretsAndCredentials(files: Array<{ path: string; content: string }>): PreCommitTestItem {
  const secretRegex = /(ghp_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}|(?:AIzaSy)[a-zA-Z0-9_-]{33}|(?:sk-[a-zA-Z0-9]{20,})|-----BEGIN (?:RSA )?PRIVATE KEY-----)/;
  const leakFiles = files.filter((f) => secretRegex.test(f.content)).map((f) => f.path);
  return {
    id: 'test-secrets',
    name: '4. Uji Keamanan & Kebocoran Token/Key',
    description: 'Memastikan tidak ada API Key, Private Key, atau token rahasia yang bocor.',
    passed: leakFiles.length === 0,
    severity: 'error',
    message: leakFiles.length === 0 ? 'Tidak ada kunci rahasia atau token terbuka terdeteksi.' : `Kunci rahasia terdeteksi di: ${leakFiles.join(', ')}`,
    failedFiles: leakFiles,
  };
}

export function testTypoAndDuplicateImports(files: Array<{ path: string; content: string }>): PreCommitTestItem {
  const issues: string[] = [];
  const commonTypos = [
    { pattern: /\b(recieve|recieved)\b/i, fix: 'receive/received' },
    { pattern: /\b(seperate|seperated)\b/i, fix: 'separate/separated' },
    { pattern: /\b(occured)\b/i, fix: 'occurred' },
    { pattern: /\b(refered)\b/i, fix: 'referred' },
    { pattern: /\b(definately)\b/i, fix: 'definitely' },
    { pattern: /\b(consle\.log)\b/, fix: 'console.log' },
    { pattern: /\b(retrun)\b/, fix: 'return' },
    { pattern: /\b(fucntion|funtion)\b/, fix: 'function' },
  ];

  for (const f of files) {
    // 1. Cek Typo Fatal pada Keyword & Variabel
    for (const typo of commonTypos) {
      if (typo.pattern.test(f.content)) {
        issues.push(`${f.path} (Typo: ganti ke "${typo.fix}")`);
      }
    }

    // 2. Cek Impor Duplikat
    if (/\.(ts|tsx|js|jsx)$/.test(f.path)) {
      const importLines = f.content.split('\n').filter((l) => l.trim().startsWith('import '));
      const importedSources = importLines.map((l) => {
        const match = l.match(/from\s+['"]([^'"]+)['"]/);
        return match ? match[1] : null;
      }).filter(Boolean) as string[];

      const duplicates = importedSources.filter((item, index) => importedSources.indexOf(item) !== index);
      if (duplicates.length > 0) {
        issues.push(`${f.path} (Impor duplikat dari: ${duplicates.join(', ')})`);
      }
    }
  }

  return {
    id: 'test-typos',
    name: '5. Uji Zero-Typo & Duplikasi Impor',
    description: 'Mendeteksi salah ketik kata kunci coding dan impor modul berganda.',
    passed: issues.length === 0,
    severity: 'warning',
    message: issues.length === 0 ? 'Bebas typo keyword dan tidak ada impor duplikat.' : `Peringatan typo/impor: ${issues.join('; ')}`,
    failedFiles: issues,
  };
}

export function testFileLengthCompliance(files: Array<{ path: string; content: string }>): PreCommitTestItem {
  const longFiles = files.filter((f) => f.content.split('\n').length > 125).map((f) => {
    const lines = f.content.split('\n').length;
    return `${f.path} (${lines} baris)`;
  });

  return {
    id: 'test-modularity',
    name: '6. Uji Modularitas (<125 Baris)',
    description: 'Memastikan file mematuhi batas ukuran modular agar mudah di-maintain.',
    passed: longFiles.length === 0,
    severity: 'warning',
    message: longFiles.length === 0 ? 'Semua berkas mematuhi standar modular (<125 baris).' : `Berkas melebihi 125 baris: ${longFiles.join(', ')}`,
    failedFiles: longFiles,
  };
}
