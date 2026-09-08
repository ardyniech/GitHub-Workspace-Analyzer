import { RollbackResponse } from '../logic/types';

export const timeMachineApi = {
  async rollback(commitHash: string): Promise<RollbackResponse> {
    try {
      const res = await fetch('/api/git/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commitHash }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Proses rollback ke commit gagal.');
      }
      return data;
    } catch (err: any) {
      console.error('[Module:TimeMachine] Error in rollback:', err?.message || err);
      throw new Error(err?.message || 'Kendala saat membatalkan perubahan commit.');
    }
  },

  async createSnapshot(label?: string): Promise<RollbackResponse> {
    try {
      const res = await fetch('/api/git/snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat titik pemulihan snapshot.');
      }
      return data;
    } catch (err: any) {
      console.error('[Module:TimeMachine] Error in createSnapshot:', err?.message || err);
      throw new Error(err?.message || 'Terjadi kendala saat menyimpan snapshot.');
    }
  },
};
