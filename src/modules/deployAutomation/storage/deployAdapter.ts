import { DeploymentRecord } from '../logic/types';

const DEPLOY_CACHE_PREFIX = 'deploy_record_v1_';

export const deployStorageAdapter = {
  saveRecord(repoFullName: string, record: DeploymentRecord): void {
    try {
      localStorage.setItem(`${DEPLOY_CACHE_PREFIX}${repoFullName}`, JSON.stringify(record));
    } catch (e) {
      console.warn('[deployAutomation] Error saving deployment record:', e);
    }
  },

  getRecord(repoFullName: string): DeploymentRecord | null {
    try {
      const raw = localStorage.getItem(`${DEPLOY_CACHE_PREFIX}${repoFullName}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[deployAutomation] Error reading deployment record:', e);
      return null;
    }
  },
  
  clearRecord(repoFullName: string): void {
    try {
      localStorage.removeItem(`${DEPLOY_CACHE_PREFIX}${repoFullName}`);
    } catch {
      // ignore
    }
  }
};
