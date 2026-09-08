import { GitStatusResponse, GitPushPayload, GitPushResult } from '../logic/types';

export const gitSyncApi = {
  async fetchStatus(): Promise<GitStatusResponse> {
    try {
      const res = await fetch('/api/git/status');
      if (!res.ok) {
        throw new Error('Gagal memuat status Git dari server.');
      }
      return await res.json();
    } catch (err: any) {
      console.error('[Module:GitSync] Error in fetchStatus:', err?.message || err);
      throw new Error(err?.message || 'Kendala jaringan saat membaca status Git.');
    }
  },

  async push(payload: GitPushPayload): Promise<GitPushResult> {
    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Proses push ke GitHub gagal.');
      }
      return data;
    } catch (err: any) {
      console.error('[Module:GitSync] Error in push:', err?.message || err);
      throw new Error(err?.message || 'Terjadi kesalahan saat melakukan push.');
    }
  },
};
