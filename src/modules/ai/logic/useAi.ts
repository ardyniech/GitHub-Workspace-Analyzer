import { useState, useEffect } from 'react';
import { aiApi } from '../storage/api';
import { dispatcher } from '../../../core/dispatcher';
import { extractDeepRepoContext } from '../../repo/storage/repoContextExtractor';
import { buildAgentMemoryContext, autoRecordConversationSummary } from '../../memory';
import { executeAgentTool, executeCopilotPush } from './copilotActionExecutor';

export interface ChatMessage { id: string; sender: 'user' | 'assistant'; text: string; }

export function useAi(repoFullName: string | undefined, repoDescription: string | null, token?: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', sender: 'assistant', text: 'Halo! Saya AI Coding Copilot siap melayani eksekusi otonom dengan akses baca file real-time.' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeModel, setActiveModel] = useState<string>('gemini-2.5-flash');

  const sendMessage = async (text: string, readmeText: string = '', isFixPrTrigger: boolean = false) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'user', text }]);
    setLoading(true); setError('');

    let deepRepoInfo = '';
    if (repoFullName) try { deepRepoInfo = await extractDeepRepoContext(repoFullName, token); } catch {}
    
    const context = `Repository: ${repoFullName || 'Belum dipilih'}\nDeskripsi: ${repoDescription || 'Tidak ada'}\n${buildAgentMemoryContext(repoFullName)}\n${deepRepoInfo}\n--- README ---\n${readmeText ? readmeText.slice(0, 2000) : 'N/A'}`;

    try {
      let currentPrompt = text;
      let finalRes = '';

      for (let step = 0; step < 5; step++) {
        const aiResponse = await aiApi.analyzeRepo(currentPrompt, context);
        if (aiResponse.model) setActiveModel(aiResponse.model);
        finalRes = aiResponse.text;
        
        const toolMatch = finalRes.match(/```tool_call\n([\s\S]*?)\n```/);
        if (toolMatch && token && repoFullName) {
          try {
            const { tool, path, resultStr } = await executeAgentTool(toolMatch[1], repoFullName, token);
            setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'assistant', text: `> 🛠️ **AGENT TOOL:** Mengeksekusi \`${tool}\` pada \`${path}\`...` }]);
            currentPrompt += `\n\n[Sistem] Hasil ${tool} pada ${path}:\n${resultStr.slice(0, 6000)}\n\nLanjutkan tugas.`;
            continue;
          } catch (err: any) {
            setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'assistant', text: `> ❌ **TOOL ERROR:** ${err.message}` }]);
            break;
          }
        }

        const copilotMatch = finalRes.match(/```copilot\n([\s\S]*?)\n```/);
        if (copilotMatch && token && repoFullName) {
          try {
            const pushLogs = await executeCopilotPush(copilotMatch[1], repoFullName, token, (log) => {
              setMessages((prev) => { const n = [...prev]; n[n.length - 1] = { id: Math.random().toString(), sender: 'assistant', text: finalRes + log }; return n; });
            });
            finalRes += pushLogs;
          } catch (err: any) { finalRes += `\n> ❌ **ACTION FAILED:** ${err.message}`; }
        }

        setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'assistant', text: finalRes }]);
        break;
      }

      if (text.length > 25 && !isFixPrTrigger) {
        autoRecordConversationSummary(repoFullName, text.slice(0, 40) + '...', `Tanya: ${text.slice(0, 80)}\nJawab AI: ${finalRes.slice(0, 120)}...`);
      }
      dispatcher.emit('notify:push', { type: 'success', title: 'Eksekusi Selesai', message: 'Agen telah menyelesaikan instruksi.' });
    } catch (err: any) {
      const friendlyErr = err.message || 'Gagal merespon.';
      setError(friendlyErr);
      setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'assistant', text: `⚠️ **Error**: ${friendlyErr}` }]);
      dispatcher.emit('notify:push', { type: 'error', title: 'Gagal Memproses AI', message: friendlyErr });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubPrompt = dispatcher.on('ai:send_prompt', (data: { prompt: string; isFixPr?: boolean }) => {
      if (data?.prompt) sendMessage(data.prompt, '', !!data.isFixPr);
    });
    const unsubExec = dispatcher.on('ai:executeCommand', (data: { prompt: string }) => {
      if (data?.prompt) sendMessage(data.prompt, '', false);
    });
    return () => {
      unsubPrompt();
      unsubExec();
    };
  }, [repoFullName, repoDescription, token]);

  return {
    messages, loading, error, activeModel, sendMessage,
    clearChat: () => setMessages([{ id: 'welcome-reset', sender: 'assistant', text: 'Sesi direset.' }])
  };
}
