import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export interface FileCandidate {
  path: string;
  lines: number;
  size: number;
  priority: 'high' | 'medium' | 'normal';
}

const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', '.cache', 'build', 'coverage']);

export function getRefactorCandidateFiles(rootDir = process.cwd()): FileCandidate[] {
  const candidates: FileCandidate[] = [];
  const srcDir = path.join(rootDir, 'src');
  if (!fs.existsSync(srcDir)) return [];

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          scan(path.join(dir, entry.name));
        }
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        const fullPath = path.join(dir, entry.name);
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n').length;
          const stat = fs.statSync(fullPath);
          const relPath = path.relative(rootDir, fullPath);
          const priority = lines > 110 ? 'high' : lines > 90 ? 'medium' : 'normal';
          candidates.push({ path: relPath, lines, size: stat.size, priority });
        } catch {
          // ignore unreadable
        }
      }
    }
  }

  scan(srcDir);
  return candidates.sort((a, b) => b.lines - a.lines);
}

export function readWorkspaceFileSafe(relPath: string, rootDir = process.cwd()): string {
  const cleanPath = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(rootDir, cleanPath);
  if (!fullPath.startsWith(rootDir) || !fs.existsSync(fullPath)) {
    throw new Error(`Berkas tidak ditemukan atau berada di luar workspace: ${relPath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

export function applyRefactorToWorkspace(
  relPath: string,
  newContent: string,
  commitMessage: string,
  rootDir = process.cwd()
): { success: boolean; commitHash: string; message: string; lines: number } {
  const cleanPath = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(rootDir, cleanPath);
  if (!fullPath.startsWith(rootDir)) {
    throw new Error(`Path berkas tidak valid: ${relPath}`);
  }

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, newContent, 'utf8');
  const lines = newContent.split('\n').length;

  let commitHash = 'local';
  try {
    execSync(`git add "${cleanPath}"`, { cwd: rootDir, stdio: 'pipe' });
    const msg = commitMessage || `refactor: optimize and modularize ${path.basename(cleanPath)}`;
    execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { cwd: rootDir, stdio: 'pipe' });
    commitHash = execSync('git rev-parse --short HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (gitErr: any) {
    console.warn('[Module:Refactor] Git commit skipped or working tree clean:', gitErr?.message);
  }

  return {
    success: true,
    commitHash,
    message: `Refactor berhasil diterapkan pada ${cleanPath} (${lines} baris).`,
    lines,
  };
}
