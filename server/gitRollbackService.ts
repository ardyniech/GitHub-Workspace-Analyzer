import { execSync } from 'child_process';

export interface RollbackResult {
  success: boolean;
  message: string;
  newCommitHash?: string;
}

export function rollbackToCommit(commitHash: string): RollbackResult {
  try {
    const cleanHash = commitHash.trim().replace(/[^a-f0-9]/gi, '');
    if (!cleanHash) {
      throw new Error('Hash commit tidak valid.');
    }

    // Verify commit exists
    execSync(`git cat-file -t ${cleanHash}`, { stdio: 'pipe' });

    // Try creating a clean revert commit
    try {
      execSync(`git revert --no-edit ${cleanHash}`, { stdio: 'pipe' });
      const newHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      return {
        success: true,
        message: `Berhasil me-revert commit ${cleanHash}. Commit baru: ${newHash}`,
        newCommitHash: newHash,
      };
    } catch {
      // If direct revert conflicts, soft-reset and create a rollback snapshot
      execSync(`git checkout ${cleanHash} -- .`, { stdio: 'pipe' });
      execSync('git add -A', { stdio: 'pipe' });
      execSync(`git commit -m "revert(rollback): restore working tree to ${cleanHash}"`, { stdio: 'pipe' });
      const newHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      return {
        success: true,
        message: `Working tree berhasil dipulihkan ke versi commit ${cleanHash}. Commit pemulihan: ${newHash}`,
        newCommitHash: newHash,
      };
    }
  } catch (err: any) {
    console.error('[Module:TimeMachine] Error in rollbackToCommit:', err?.message || err);
    throw new Error(err?.message || `Gagal membatalkan commit ${commitHash}`);
  }
}

export function createRestoreSnapshot(label?: string): RollbackResult {
  try {
    const cleanLabel = (label || 'Manual Restore Point').replace(/["`$\\]/g, '');
    execSync('git add -A', { stdio: 'pipe' });
    try {
      execSync(`git commit -m "snapshot(restore-point): ${cleanLabel}"`, { stdio: 'pipe' });
    } catch {
      // Nothing to commit if working tree is clean
    }
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    return {
      success: true,
      message: `Titik pemulihan berhasil dibuat pada commit ${hash}`,
      newCommitHash: hash,
    };
  } catch (err: any) {
    console.error('[Module:TimeMachine] Error in createRestoreSnapshot:', err?.message || err);
    throw new Error(err?.message || 'Gagal membuat titik pemulihan snapshot.');
  }
}
