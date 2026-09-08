import { DependencyItem } from './manifestTypes';

export function parsePackageJson(content: string): DependencyItem[] {
  try {
    const pkg = JSON.parse(content);
    const result: DependencyItem[] = [];
    if (pkg.dependencies && typeof pkg.dependencies === 'object') {
      Object.entries(pkg.dependencies).forEach(([name, version]) => {
        result.push({ name, version: String(version), isDev: false });
      });
    }
    if (pkg.devDependencies && typeof pkg.devDependencies === 'object') {
      Object.entries(pkg.devDependencies).forEach(([name, version]) => {
        result.push({ name, version: String(version), isDev: true });
      });
    }
    return result;
  } catch {
    return [];
  }
}

export function parseRequirementsTxt(content: string): DependencyItem[] {
  const lines = content.split('\n');
  const result: DependencyItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('-r')) continue;

    // Matches package==1.2.3, package>=1.0, package~=2.0, package
    const match = trimmed.match(/^([a-zA-Z0-9_\-.]+)\s*([=><~^!]=?.*)?$/);
    if (match) {
      result.push({
        name: match[1],
        version: match[2] ? match[2].trim() : '*',
        isDev: false,
      });
    }
  }
  return result;
}
