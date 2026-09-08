import { SecurityFinding } from './scannerRules';

interface KnownVulnerablePkg {
  name: string;
  maxVulnerableVersion?: string;
  reason: string;
  safeAlternative: string;
}

const RISKY_PACKAGES: KnownVulnerablePkg[] = [
  {
    name: 'request',
    reason: 'Paket request sudah deprecated dan ditinggalkan pengembang sejak 2020.',
    safeAlternative: 'Gunakan native fetch atau axios versi terbaru.',
  },
  {
    name: 'moment',
    reason: 'Paket moment dalam mode pemeliharaan (legacy) dengan ukuran bundel besar.',
    safeAlternative: 'Gunakan date-fns atau Intl.DateTimeFormat modern.',
  },
  {
    name: 'event-stream',
    reason: 'Pernah disusupi malware injeksi (supply chain attack).',
    safeAlternative: 'Hapus paket ini dan ganti dengan stream native Node.js.',
  },
  {
    name: 'flatmap-stream',
    reason: 'Paket berbahaya yang diketahui mencuri kunci dompet kripto.',
    safeAlternative: 'Segera hapus dari dependencies.',
  },
];

export function auditDependencies(content: string, filePath: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const isPackageJson = filePath.endsWith('package.json');

  if (!isPackageJson) return findings;

  try {
    const pkg = JSON.parse(content);
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    for (const [depName, versionRaw] of Object.entries(allDeps)) {
      const version = String(versionRaw).trim();

      // Check wildcard or insecure versions
      if (version === '*' || version === 'latest' || version.startsWith('>=')) {
        findings.push({
          id: `dep-wildcard-${depName}`,
          type: 'vulnerable_dep',
          severity: 'warning',
          title: `Versi Fleksibel Berisiko: ${depName}@${version}`,
          description: `Versi "*" atau "latest" rentan terhadap serangan supply chain jika paket diperbarui secara tak terduga.`,
          recommendation: 'Kunci versi dependensi menggunakan versi semver spesifik (misal: ^1.2.3).',
          lineSnippet: `"${depName}": "${version}"`,
        });
      }

      // Check risky / deprecated known packages
      const known = RISKY_PACKAGES.find((k) => k.name === depName);
      if (known) {
        findings.push({
          id: `dep-risky-${depName}`,
          type: 'vulnerable_dep',
          severity: 'critical',
          title: `Dependensi Rentan/Usang: ${depName}`,
          description: known.reason,
          recommendation: known.safeAlternative,
          lineSnippet: `"${depName}": "${version}"`,
        });
      }
    }
  } catch {
    // If not valid JSON, ignore silently
  }

  return findings;
}
