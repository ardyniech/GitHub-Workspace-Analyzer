import { CONFIG } from '../../../core/config';
import { WeeklyCommitActivity, ParticipationActivity } from '../logic/types';

export const analyticsApi = {
  async fetchCommitActivity(fullName: string, token?: string | null): Promise<WeeklyCommitActivity[]> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/stats/commit_activity`, { headers });
    if (!res.ok) {
      if (res.status === 202) {
        return [];
      }
      throw new Error('Gagal memuat data statistik aktivitas mingguan.');
    }
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => {
      const date = new Date(item.week * 1000);
      const weekLabel = `${date.getDate()}/${date.getMonth() + 1}`;
      return {
        week: item.week,
        total: item.total || 0,
        days: item.days || [0, 0, 0, 0, 0, 0, 0],
        weekLabel,
      };
    });
  },

  async fetchParticipation(fullName: string, token?: string | null): Promise<ParticipationActivity | null> {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `token ${token}`;

    const res = await fetch(`${CONFIG.GITHUB_API}/repos/${fullName}/stats/participation`, { headers });
    if (!res.ok) return null;
    return res.json();
  },
};
