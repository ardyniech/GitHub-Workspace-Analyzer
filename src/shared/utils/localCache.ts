import { Repository } from '../../modules/repo/storage/api';

const REPOS_CACHE_PREFIX = 'repo_cache_v1_';
const README_CACHE_PREFIX = 'readme_cache_v1_';
const AI_INSIGHT_CACHE_PREFIX = 'ai_insight_v1_';

export const localCacheManager = {
  // Repository list cache
  saveRepos(key: string, repos: Repository[]): void {
    try {
      localStorage.setItem(`${REPOS_CACHE_PREFIX}${key}`, JSON.stringify(repos));
    } catch (e) {
      console.warn('[CacheManager] Error saving repos to localStorage:', e);
    }
  },

  getRepos(key: string): Repository[] | null {
    try {
      const raw = localStorage.getItem(`${REPOS_CACHE_PREFIX}${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // README file cache
  saveReadme(repoFullName: string, readme: string): void {
    try {
      localStorage.setItem(`${README_CACHE_PREFIX}${repoFullName}`, readme);
    } catch (e) {
      console.warn('[CacheManager] Error saving README to localStorage:', e);
    }
  },

  getReadme(repoFullName: string): string | null {
    try {
      return localStorage.getItem(`${README_CACHE_PREFIX}${repoFullName}`);
    } catch {
      return null;
    }
  },

  // Generic AI Insights cache (e.g. analysis results)
  saveAiInsight(repoFullName: string, insightKey: string, data: any): void {
    try {
      localStorage.setItem(
        `${AI_INSIGHT_CACHE_PREFIX}${repoFullName}_${insightKey}`,
        JSON.stringify(data)
      );
    } catch (e) {
      console.warn('[CacheManager] Error saving AI insight to localStorage:', e);
    }
  },

  getAiInsight<T>(repoFullName: string, insightKey: string): T | null {
    try {
      const raw = localStorage.getItem(`${AI_INSIGHT_CACHE_PREFIX}${repoFullName}_${insightKey}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearAll(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith(REPOS_CACHE_PREFIX) ||
          key.startsWith(README_CACHE_PREFIX) ||
          key.startsWith(AI_INSIGHT_CACHE_PREFIX)
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('[CacheManager] Error clearing cache:', e);
    }
  },
};
