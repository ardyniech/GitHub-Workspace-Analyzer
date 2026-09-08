import { useState, useRef, useCallback, useEffect } from 'react';
import { VoiceCommanderStatus, VoiceCommandIntent } from './types';
import { VoiceSpeechService } from './speechRecognition';
import { parseVoiceIntent } from './intentParser';
import { voiceHistoryStorage } from '../storage/voiceHistory';
import { dispatcher } from '../../../core/dispatcher';
import { gitTreeApi, RepoTreeEntry } from '../../repo/storage/gitTreeApi';
import { issueApi } from '../../issue/storage/api';

export function useVoiceCommander(repoFullName?: string, token?: string | null) {
  const [status, setStatus] = useState<VoiceCommanderStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [intent, setIntent] = useState<VoiceCommandIntent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<RepoTreeEntry[]>([]);
  const [searching, setSearching] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const serviceRef = useRef<VoiceSpeechService | null>(null);

  const stopListening = useCallback(() => {
    serviceRef.current?.stop();
    if (status === 'listening') setStatus(intent ? 'recognized' : 'idle');
  }, [status, intent]);

  const startListening = useCallback(async () => {
    setErrorMessage(null);
    setExecutionMessage(null);
    setTranscript('');
    setIntent(null);
    setSearchResults([]);
    setStatus('listening');

    serviceRef.current = new VoiceSpeechService(
      (text) => {
        setTranscript(text);
        const parsed = parseVoiceIntent(text);
        setIntent(parsed);
      },
      (vol) => setVolumeLevel(vol),
      (err) => { setErrorMessage(err); setStatus('error'); },
      () => { if (status === 'listening') setStatus('recognized'); }
    );

    const ok = await serviceRef.current.start();
    if (!ok) setStatus('error');
  }, [status]);

  const executeIntent = async (overrideIntent?: VoiceCommandIntent) => {
    const targetIntent = overrideIntent || intent;
    if (!targetIntent) return;
    setStatus('executing');
    setErrorMessage(null);

    try {
      if (targetIntent.type === 'ANALYZE_REPO') {
        const repo = repoFullName || 'repositori aktif';
        const topic = targetIntent.params.analysisTopic || 'keamanan dan arsitektur umum';
        const prompt = `Lakukan analisis mendalam repositori "${repo}" dengan fokus pada ${topic}. Sertakan ringkasan temuan, evaluasi kesehatan, dan rekomendasi perbaikan.`;
        dispatcher.emit('notify:push', { type: 'info', title: 'Perintah Suara Dijalankan', message: `Menganalisis ${topic} untuk ${repo}...` });
        dispatcher.emit('ai:send_prompt', { prompt });
        setExecutionMessage(`Analisis "${topic}" telah dikirim ke AI Agent Executor.`);
        setStatus('success');
      } else if (targetIntent.type === 'SEARCH_FILE') {
        if (!repoFullName) throw new Error('Pilih repositori terlebih dahulu untuk mencari berkas.');
        setSearching(true);
        const { tree } = await gitTreeApi.fetchRecursiveTree(repoFullName, token);
        const query = (targetIntent.params.query || '').toLowerCase();
        const matches = tree.filter((t) => t.type === 'blob' && t.path.toLowerCase().includes(query)).slice(0, 15);
        setSearchResults(matches);
        setSearching(false);
        setExecutionMessage(`Ditemukan ${matches.length} berkas yang cocok dengan "${query}".`);
        setStatus('success');
      } else if (targetIntent.type === 'CREATE_ISSUE') {
        if (!repoFullName || !token) throw new Error('Token GitHub diperlukan untuk membuat issue baru.');
        const title = targetIntent.params.issueTitle || 'Issue Baru via Voice Commander';
        const body = targetIntent.params.issueBody || 'Dibuat via Voice Commander.';
        await issueApi.createIssue(repoFullName, title, body, token);
        dispatcher.emit('notify:push', { type: 'success', title: 'Issue Dibuat', message: `Berhasil mendaftarkan issue: "${title}".` });
        setExecutionMessage(`Issue "${title}" berhasil dibuat di GitHub.`);
        setStatus('success');
      } else {
        dispatcher.emit('ai:send_prompt', { prompt: transcript });
        setExecutionMessage(`Pertanyaan telah diteruskan ke Copilot AI.`);
        setStatus('success');
      }

      voiceHistoryStorage.addEntry({ transcript, intentType: targetIntent.type });
    } catch (err: any) {
      console.error(`[Module:VoiceCommander] Error in executeIntent: ${err?.message || err}`);
      setErrorMessage(err?.message || 'Gagal mengeksekusi perintah suara.');
      setStatus('error');
    }
  };

  useEffect(() => () => { serviceRef.current?.stop(); }, []);

  return {
    status, transcript, volumeLevel, intent, errorMessage, searchResults, searching, executionMessage,
    startListening, stopListening, executeIntent,
    setManualCommand: (text: string) => {
      setTranscript(text);
      const parsed = parseVoiceIntent(text);
      setIntent(parsed);
      setStatus('recognized');
    },
    reset: () => { setStatus('idle'); setTranscript(''); setIntent(null); setSearchResults([]); setExecutionMessage(null); }
  };
}
