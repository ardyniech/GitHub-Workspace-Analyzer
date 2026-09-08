import { VoiceHistoryEntry } from '../logic/types';

const STORAGE_KEY = 'ai_agent_voice_history';

export const voiceHistoryStorage = {
  getHistory(): VoiceHistoryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err: any) {
      console.error(`[Module:VoiceCommander] Error in getHistory: ${err?.message || err}`);
      return [];
    }
  },

  addEntry(entry: Omit<VoiceHistoryEntry, 'id' | 'timestamp'>): void {
    try {
      const list = this.getHistory();
      const newEntry: VoiceHistoryEntry = {
        ...entry,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...list.slice(0, 9)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err: any) {
      console.error(`[Module:VoiceCommander] Error in addEntry: ${err?.message || err}`);
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err: any) {
      console.error(`[Module:VoiceCommander] Error in clear: ${err?.message || err}`);
    }
  },
};
