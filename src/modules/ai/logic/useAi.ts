import { useState, useEffect } from 'react';
import { aiApi } from '../storage/api';
import { fileApi } from '../../repo/storage/fileApi';
import { branchApi } from '../../repo/storage/branchApi';
import { dispatcher } from '../../../core/dispatcher';
import { extractDeepRepoContext } from '../../repo/storage/repoContextExtractor';
import { buildAgentMemoryContext, autoRecordConversationSummary } from '../../memory';

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
    
    const context = `Repository: ${repoFullName || 'Belum dipilih'}
      Deskripsi: ${repoDescription || 'Tidak ada'}
      ${buildAgentMemoryContext(repoFullName)}
      ${deepRepoInfo}
      --- README SNIPPET ---
      ${readmeText ? readmeText.slice(0, 2000) : 'N/A'}`;

    try {
      let currentPrompt = text;
      let finalRes = '';
      const maxAgentSteps = 5;

      for (let step = 0; step < maxAgentSteps; step++) {
        const aiResponse = await aiApi.analyzeRepo(currentPrompt, context);
        if (aiResponse.model) setActiveModel(aiResponse.model);
        
        finalRes = aiResponse.text;
        
        // Cek apakah ada Tool Call
        const toolMatch = finalRes.match(/```tool_call\n([\s\S]*?)\n```/);
        if (toolMatch && token && repoFullName) {
          try {
            const toolReq = JSON.parse(toolMatch[1]);
            let toolResultStr = '';
            
            setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'assistant', text: `> 🛠️ **AGENT TOOL CALL:** Mengeksekusi \`${toolReq.tool}\` pada \`${toolReq.path}\`...` }]);

            if (toolReq.tool === 'read_file') {
              const fileData = await fileApi.fetchFileContent(repoFullName, toolReq.path, token);
              toolResultStr = fileData.content ? fileData.content : 'Berkas kosong atau tidak ditemukan.';
            } else if (toolReq.tool === 'list_dir') {
              const dirData = await fileApi.fetchContents(repoFullName, toolReq.path, token);
              toolResultStr = dirData.map((d: any) => `${d.type === 'dir'?'📁':'📄'} ${d.name}`).join('\n') || 'Direktori kosong atau tidak ditemukan.';
            } else {
              toolResultStr = `Tool ${toolReq.tool} tidak dikenali.`;
            }

            currentPrompt += `\n\n[Sistem] Hasil dari tool ${toolReq.tool} pada ${toolReq.path}:\n${toolResultStr.slice(0, 6000)}\n\nLanjutkan tugas.`;
            continue; // Loop kembali untuk prompt berikutnya
          } catch (err: any) {
             setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'assistant', text: `> ❌ **TOOL CALL FAILED:** ${err.message}` }]);
             break;
          }
        }

        // Cek Copilot block (Final execution)
        const copilotMatch = finalRes.match(/```copilot\n([\s\S]*?)\n```/);
        
        if (copilotMatch && token && repoFullName) {
          try {
            const pushData = JSON.parse(copilotMatch[1]);
            if (pushData.commitMessage && Array.isArray(pushData.files)) {
              finalRes += `\n\n> 🚀 **AUTONOMOUS ACTION:** Mengirim ${pushData.files.length} berkas...`;
              if (pushData.branch) {
                finalRes += `\n> 🌿 Membuat branch: \`${pushData.branch}\``;
                setMessages((prev) => [...prev, { id: Math.random().toString(), sender: 'assistant', text: finalRes }]);
                const defBranch = await branchApi.getDefaultBranch(repoFullName, token);
                const baseSha = await branchApi.getBranchSha(repoFullName, defBranch, token);
                await branchApi.createBranch(repoFullName, pushData.branch, baseSha, token).catch(() => null);
              }
              
              setMessages((prev) => { const n = [...prev]; n[n.length - 1] = { id: Math.random().toString(), sender: 'assistant', text: finalRes }; return n; });
              
              for (const file of pushData.files) {
                if (file.path) {
                  if (file.deleted) {
                    const cur = await fileApi.fetchFileContent(repoFullName, file.path, token, pushData.branch).catch(() => null);
                    if (cur?.sha) {
                      await fileApi.deleteFile(repoFullName, file.path, pushData.commitMessage, token, cur.sha, pushData.branch);
                    }
                  } else if (file.content !== undefined) {
                    const cur = await fileApi.fetchFileContent(repoFullName, file.path, token, pushData.branch).catch(() => null);
                    await fileApi.commitFile(repoFullName, file.path, file.content, pushData.commitMessage, token, cur?.sha, pushData.branch);
                  }
                }
              }
              finalRes += `\n> ✅ **ACTION SUCCESS:** Commit berhasil.`;
              
              if (pushData.createPr && pushData.branch) {
                finalRes += `\n> 🔀 Membuka Pull Request...`;
                setMessages((prev) => { const n = [...prev]; n[n.length - 1] = { id: Math.random().toString(), sender: 'assistant', text: finalRes }; return n; });
                const defBranch = await branchApi.getDefaultBranch(repoFullName, token);
                const prRes = await branchApi.createPullRequest(repoFullName, pushData.createPr.title || pushData.commitMessage, pushData.branch, defBranch, pushData.createPr.body || '', token);
                finalRes += `\n> 🎉 **PR DIBUAT:** [Lihat Pull Request](${prRes.html_url})`;
              }
            }
          } catch (err: any) { finalRes += `\n> ❌ **ACTION FAILED:** ${err.message}`; }
        }

        setMessages((prev) => {
          if (copilotMatch && token && repoFullName) {
             const newMsg = [...prev];
             newMsg[newMsg.length - 1] = { id: Math.random().toString(), sender: 'assistant', text: finalRes };
             return newMsg;
          }
          return [...prev, { id: Math.random().toString(), sender: 'assistant', text: finalRes }];
        });

        // Break out of agent step loop since we completed
        break; 
      }

      if (text.length > 25 && !isFixPrTrigger) {
        autoRecordConversationSummary(repoFullName, text.slice(0, 40) + '...', `Tanya: ${text.slice(0, 100)}\nJawab AI: ${finalRes.slice(0, 160)}...`);
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
    const unsub = dispatcher.on('ai:send_prompt', (data: { prompt: string; isFixPr?: boolean }) => {
      if (data?.prompt) sendMessage(data.prompt, '', !!data.isFixPr);
    });
    return () => unsub();
  }, [repoFullName, repoDescription, token]);

  return {
    messages, loading, error, activeModel, sendMessage,
    clearChat: () => setMessages([{ id: 'welcome-reset', sender: 'assistant', text: 'Sesi direset.' }])
  };
}
