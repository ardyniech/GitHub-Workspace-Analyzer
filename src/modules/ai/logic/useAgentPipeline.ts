import { useState, useCallback } from 'react';
import { aiApi } from '../storage/api';
import { extractDeepRepoContext } from '../../repo/storage/repoContextExtractor';
import { buildAgentMemoryContext } from '../../memory';
import { fileApi } from '../../repo/storage/fileApi';
import { branchApi } from '../../repo/storage/branchApi';

export type PipelineStatus = 'idle' | 'running' | 'success' | 'failed';
export type TaskStatus = 'pending' | 'running' | 'success' | 'failed';

export interface AgentTask { id: string; name: string; prompt: string; status: TaskStatus; result?: string; }

export function useAgentPipeline(repoFullName?: string, repoDescription?: string | null, token?: string | null) {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('idle');

  const startPipeline = useCallback(async (newTasks: Omit<AgentTask, 'status'>[], readmeText: string = '') => {
    if (!repoFullName) return;
    const initializedTasks = newTasks.map(t => ({ ...t, status: 'pending' as TaskStatus }));
    setTasks(initializedTasks); setPipelineStatus('running');
    
    let deepRepoInfo = '';
    if (token) try { deepRepoInfo = await extractDeepRepoContext(repoFullName, token); } catch {}
    
    let accumulatedContext = `
      Repository: ${repoFullName}
      Deskripsi: ${repoDescription || 'Tidak ada'}
      ${buildAgentMemoryContext(repoFullName)}
      ${deepRepoInfo}
      --- README ---
      ${readmeText ? readmeText.slice(0, 1500) : 'N/A'}
    `;

    for (let i = 0; i < initializedTasks.length; i++) {
      setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'running' } : t));
      try {
        const res = await aiApi.analyzeRepo(initializedTasks[i].prompt, accumulatedContext);
        let finalRes = res.text;
        
        const copilotMatch = finalRes.match(/```copilot\n([\s\S]*?)\n```/);
        if (copilotMatch && token) {
          try {
            const pushData = JSON.parse(copilotMatch[1]);
            if (pushData.commitMessage && Array.isArray(pushData.files)) {
              finalRes += `\n\n> 🚀 **AUTONOMOUS ACTION DETECTED:** Mengirim ${pushData.files.length} berkas...`;
              if (pushData.branch) {
                finalRes += `\n> 🌿 Membuat branch: \`${pushData.branch}\``;
                setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, result: finalRes } : t));
                const defBranch = await branchApi.getDefaultBranch(repoFullName, token);
                const baseSha = await branchApi.getBranchSha(repoFullName, defBranch, token);
                await branchApi.createBranch(repoFullName, pushData.branch, baseSha, token).catch(() => null);
              }
              setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, result: finalRes } : t));
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
                setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, result: finalRes } : t));
                const defBranch = await branchApi.getDefaultBranch(repoFullName, token);
                const prRes = await branchApi.createPullRequest(repoFullName, pushData.createPr.title || pushData.commitMessage, pushData.branch, defBranch, pushData.createPr.body || '', token);
                finalRes += `\n> 🎉 **PR DIBUAT:** [Lihat Pull Request](${prRes.html_url})`;
              }
            }
          } catch (err: any) { finalRes += `\n> ❌ **ACTION FAILED:** ${err.message}`; }
        }
        accumulatedContext += `\n--- HASIL TASK [${initializedTasks[i].name}] ---\n${finalRes}\n`;
        setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'success', result: finalRes } : t));
      } catch (err: any) {
        setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'failed', result: err.message } : t));
        setPipelineStatus('failed'); return; 
      }
    }
    setPipelineStatus('success');
  }, [repoFullName, repoDescription, token]);

  const clearPipeline = () => { setTasks([]); setPipelineStatus('idle'); };
  return { tasks, pipelineStatus, startPipeline, clearPipeline };
}
