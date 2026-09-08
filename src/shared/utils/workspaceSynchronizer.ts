import { localCacheManager } from './localCache';

export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  autoRefreshInterval: number; // in seconds
}

export interface WorkspaceState {
  activeRepoFullName: string | null;
  activeTab: string;
}

const PREFS_KEY = 'workspace_user_preferences_v1';
const WORKSPACE_KEY = 'workspace_active_state_v1';
const MEMORY_STATE_PREFIX = 'workspace_ai_memory_v1_';

export const workspaceSynchronizer = {
  // Persist general user preferences
  savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('[WorkspaceSync] Failed to save preferences:', e);
    }
  },

  getPreferences(): UserPreferences {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      return raw ? JSON.parse(raw) : { theme: 'light', notificationsEnabled: true, autoRefreshInterval: 30 };
    } catch {
      return { theme: 'light', notificationsEnabled: true, autoRefreshInterval: 30 };
    }
  },

  // Persist active workspace metadata (active repo, active tab)
  saveWorkspaceState(state: WorkspaceState): void {
    try {
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[WorkspaceSync] Failed to save workspace state:', e);
    }
  },

  getWorkspaceState(): WorkspaceState {
    try {
      const raw = localStorage.getItem(WORKSPACE_KEY);
      return raw ? JSON.parse(raw) : { activeRepoFullName: null, activeTab: 'overview' };
    } catch {
      return { activeRepoFullName: null, activeTab: 'overview' };
    }
  },

  // Repository-specific AI Memory states (aligned with proactive AI context)
  saveAiMemoryForRepo(repoFullName: string, memoryKey: string, data: any): void {
    localCacheManager.saveAiInsight(repoFullName, `memory_${memoryKey}`, data);
  },

  getAiMemoryForRepo(repoFullName: string, memoryKey: string): any {
    return localCacheManager.getAiInsight<any>(repoFullName, `memory_${memoryKey}`);
  },

  // Auto-sync wrapper for switching repositories
  syncRepositoryContext(repoFullName: string): void {
    const currentState = this.getWorkspaceState();
    this.saveWorkspaceState({
      ...currentState,
      activeRepoFullName: repoFullName,
    });
    
    // Auto-seed some cool proactive thoughts for this specific repo if none exist
    const memoryKey = 'proactive_thoughts';
    const existing = this.getAiMemoryForRepo(repoFullName, memoryKey) as string[] | null;
    if (!existing) {
      const initialThoughts = [
        `Menganalisis arsitektur lego-cellular khusus untuk repositori ${repoFullName}`,
        `Audit pra-flight mendeteksi modularisasi optimal pada berkas utama`,
        `Rekomendasi optimasi memori asinkron siap di-push`,
      ];
      this.saveAiMemoryForRepo(repoFullName, memoryKey, initialThoughts);
    }
  },
};
