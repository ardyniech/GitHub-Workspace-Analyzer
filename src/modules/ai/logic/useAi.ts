import { useState, useEffect } from 'react';
import { aiApi } from '../storage/api';
import { dispatcher } from '../../../core/dispatcher';
import { extractDeepRepoContext } from '../../repo/storage/repoContextExtractor';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export function useAi(repoFullName: string | undefined, repoDescription: string | null, token?: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Halo! Saya AI Copilot bertenaga Gemini 3.8 Flash. Pilih repositori untuk menganalisis kode riil, mereview manifest aktual, menjalankan Security Scan, atau mengedit berkas dan langsung push ke GitHub!',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeModel, setActiveModel] = useState<string>('gemini-3.8-flash');

  const sendMessage = async (text: string, readmeText: string = '') => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { id: Math.random().toString(), sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError('');

    let deepRepoInfo = '';
    if (repoFullName) {
      deepRepoInfo = await extractDeepRepoContext(repoFullName, token);
    }

    const context = `
      Repository: ${repoFullName || 'Belum dipilih'}
      Deskripsi: ${repoDescription || 'Tidak ada deskripsi'}
      ${deepRepoInfo}
      --- README SNIPPET ---
      ${readmeText ? readmeText.slice(0, 2000) : 'README tidak tersedia'}
    `;

    try {
      const aiResponse = await aiApi.analyzeRepo(text, context);
      if (aiResponse.model) setActiveModel(aiResponse.model);
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: 'assistant', text: aiResponse.text },
      ]);
    } catch (err: any) {
      const friendlyErr = err.message || 'Gagal merespon. Silakan coba lagi.';
      setError(friendlyErr);
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: 'assistant', text: `⚠️ **Pemberitahuan**: ${friendlyErr}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = dispatcher.on('ai:send_prompt', (payload: { prompt: string; readme?: string }) => {
      if (payload?.prompt) sendMessage(payload.prompt, payload.readme || '');
    });
    return unsub;
  }, [repoFullName, repoDescription, token]);

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Riwayat obrolan dihapus. Silakan ajukan pertanyaan atau instruksi kode baru!',
      },
    ]);
  };

  return { messages, loading, error, activeModel, sendMessage, clearChat };
}
