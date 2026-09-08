import { fileApi } from '../../repo';
import { DependencyItem, ManifestAuditResult } from './manifestTypes';

export function generateUpdatedManifestContent(
  manifestType: 'package.json' | 'requirements.txt',
  rawContent: string,
  auditResult: ManifestAuditResult
): string {
  if (manifestType === 'package.json') {
    try {
      const pkg = JSON.parse(rawContent);
      for (const vuln of auditResult.vulnerabilities) {
        if (!vuln.fixedIn) continue;
        const targetVer = vuln.fixedIn.startsWith('^') || vuln.fixedIn.startsWith('~') ? vuln.fixedIn : `^${vuln.fixedIn}`;
        if (pkg.dependencies && pkg.dependencies[vuln.packageName]) {
          pkg.dependencies[vuln.packageName] = targetVer;
        }
        if (pkg.devDependencies && pkg.devDependencies[vuln.packageName]) {
          pkg.devDependencies[vuln.packageName] = targetVer;
        }
      }
      return JSON.stringify(pkg, null, 2) + '\n';
    } catch {
      return rawContent;
    }
  } else {
    // requirements.txt
    let lines = rawContent.split('\n');
    for (const vuln of auditResult.vulnerabilities) {
      if (!vuln.fixedIn) continue;
      const targetVer = vuln.fixedIn.replace(/^[=><~^!]+/, '');
      const regex = new RegExp(`^(${vuln.packageName})\\s*([=><~^!]=?.*)?$`, 'i');
      lines = lines.map((line) => {
        if (regex.test(line.trim())) {
          return `${vuln.packageName}==${targetVer}`;
        }
        return line;
      });
    }
    return lines.join('\n');
  }
}

export async function applyAutoUpgradeCommit(
  repoFullName: string,
  auditResult: ManifestAuditResult,
  token: string
): Promise<{ success: boolean; commitUrl?: string; message: string }> {
  if (!token) {
    throw new Error('Token GitHub diperlukan untuk melakukan commit perbaikan otomatis.');
  }

  const updatedContent = generateUpdatedManifestContent(
    auditResult.manifestType as 'package.json' | 'requirements.txt',
    auditResult.rawContent,
    auditResult
  );

  const fileMeta = await fileApi.fetchFileContent(repoFullName, auditResult.manifestPath, token);
  const commitMsg = `fix(deps): bump outdated & vulnerable dependencies in ${auditResult.manifestPath}`;

  const res = await fileApi.commitFile(
    repoFullName,
    auditResult.manifestPath,
    updatedContent,
    commitMsg,
    token,
    fileMeta.sha
  );

  return {
    success: true,
    commitUrl: res.commit?.html_url || '',
    message: `Berhasil memperbarui ${auditResult.manifestPath} langsung ke cabang default!`,
  };
}
