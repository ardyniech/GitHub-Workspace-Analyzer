import { useState, useEffect } from 'react';
import { aiApi } from '../storage/api';
import { dispatcher } from '../../../core/dispatcher';
import { extractDeepRepoContext } from '../../repo/storage/repoContextExtractor';
import { buildAgentMemoryContext, autoRecordConversationSummary } from '../../memory';

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
      text: 'Halo! Saya AI Coding Copilot bertenaga Gemini Multi-Model High Availability dengan Memori Persisten. Saya mengingat progres repo, tools/skill, dan preferensi Anda!',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeModel, setActiveModel] = useState<string>('gemini-2.5-flash');

  const sendMessage = async (text: string, readmeText: string = '', isFixPrTrigger: boolean = false) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { id: Math.random().toString(), sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError('');

    let deepRepoInfo = '';
    if (repoFullName) {
      deepRepoInfo = await extractDeepRepoContext(repoFullName, token);
    }

    const memoryContext = buildAgentMemoryContext(repoFullName);

    const context = `
      Repository: ${repoFullName || 'Belum dipilih'}
      Deskripsi: ${repoDescription || 'Tidak ada deskripsi'}
      ${memoryContext}
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

      // If user asks AI to memorize or for notable insights, record conversation
      if (text.length > 25 && !isFixPrTrigger) {
        autoRecordConversationSummary(
          repoFullName,
          text.slice(0, 40) + '...',
          `Tanya: ${text.slice(0, 100)}\nJawab AI: ${aiResponse.text.slice(0, 160)}...`
        );
      }

      dispatcher.emit('notify:push', {
        type: 'success',
        title: isFixPrTrigger ? 'Draf Fix PR Selesai Disusun' : 'Analisis AI Selesai',
        message: isFixPrTrigger
          ? `Gemini telah selesai menyusun draf perbaikan dependensi untuk ${repoFullName || ''}.`
          : `Asisten AI telah menyelesaikan respon dan mengingat konteks percakapan.`,
      });
    } catch (err: any) {
      const friendlyErr = err.message || 'Gagal merespon. Silakan coba lagi.';
      setError(friendlyErr);
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: 'assistant', text: `⚠️ **Pemberitahuan**: ${friendlyErr}` },
      ]);
      dispatcher.emit('notify:push', {
        type: 'error',
        title: isFixPrTrigger ? 'Gagal Membuat Draf Fix PR' : 'Gagal Memproses AI',
        message: friendlyErr,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = dispatcher.on('ai:send_prompt', (data: { prompt: string; isFixPr?: boolean }) => {
      if (data?.prompt) sendMessage(data.prompt, '', !!data.isFixPr);
    });
    return () => unsub();
  }, [repoFullName, repoDescription, token]);

  return {
    messages,
    loading,
    error,
    activeModel,
    sendMessage,
    clearChat: () =>
      setMessages([
        {
          id: 'welcome-reset',
          sender: 'assistant',
          text: 'Percakapan telah direset. Silakan ajukan pertanyaan atau analisis repositori.',
        },
      ]),
  };
}
