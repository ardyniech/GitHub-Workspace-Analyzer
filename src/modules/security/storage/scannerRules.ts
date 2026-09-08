export interface SecurityFinding {
  id: string;
  type: 'secret_leak' | 'vulnerable_dep' | 'insecure_code';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  lineSnippet?: string;
}

interface SecretPattern {
  name: string;
  regex: RegExp;
  severity: 'critical' | 'warning';
  advice: string;
}

const SECRET_PATTERNS: SecretPattern[] = [
  {
    name: 'GitHub Personal Access Token',
    regex: /(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,255}/,
    severity: 'critical',
    advice: 'Gunakan secret GitHub Actions atau simpan di environment variable.',
  },
  {
    name: 'Google / Gemini API Key',
    regex: /AIza[0-9A-Za-z-_]{35}/,
    severity: 'critical',
    advice: 'Gunakan process.env.GEMINI_API_KEY di backend, jangan tulis langsung di file.',
  },
  {
    name: 'OpenAI Secret Key',
    regex: /sk-[a-zA-Z0-9]{20,}/,
    severity: 'critical',
    advice: 'Pindahkan secret key ke file .env atau variabel server.',
  },
  {
    name: 'AWS Access Key ID',
    regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/,
    severity: 'critical',
    advice: 'Cabut kunci AWS ini segera dan gunakan AWS IAM Roles / Secrets Manager.',
  },
  {
    name: 'Private Key Terbuka',
    regex: /-----BEGIN (?:RSA|EC|DSA|OPENSSH|PGP)?\s?PRIVATE KEY-----/,
    severity: 'critical',
    advice: 'Jangan pernah menyimpan private key di dalam repositori publik.',
  },
  {
    name: 'Hardcoded Token / Secret String',
    regex: /(?:api_key|apikey|secret|password|auth_token)\s*[:=]\s*['"][a-zA-Z0-9_\-.~+]{12,}['"]/i,
    severity: 'warning',
    advice: 'Ganti kata sandi atau kunci statis ini dengan pembacaan dari environment variable.',
  },
];

export function scanForSecrets(content: string, _filePath: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.regex.test(line)) {
        findings.push({
          id: `secret-${pattern.name}-${i + 1}`,
          type: 'secret_leak',
          severity: pattern.severity,
          title: `Terdeteksi ${pattern.name}`,
          description: `Ditemukan potensi kredensial atau kunci rahasia pada baris ${i + 1}.`,
          recommendation: pattern.advice,
          lineSnippet: line.trim().substring(0, 80),
        });
      }
    }
  }

  return findings;
}
