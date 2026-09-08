import { fileApi } from '../../repo/storage/fileApi';
import { branchApi } from '../../repo/storage/branchApi';

export async function executeAgentTool(
  toolJsonStr: string,
  repoFullName: string,
  token: string
): Promise<{ tool: string; path: string; resultStr: string }> {
  const toolReq = JSON.parse(toolJsonStr);
  let toolResultStr = '';

  if (toolReq.tool === 'read_file') {
    const fileData = await fileApi.fetchFileContent(repoFullName, toolReq.path, token);
    toolResultStr = fileData.content ? fileData.content : 'Berkas kosong atau tidak ditemukan.';
  } else if (toolReq.tool === 'list_dir') {
    const dirData = await fileApi.fetchContents(repoFullName, toolReq.path, token);
    toolResultStr =
      dirData.map((d: any) => `${d.type === 'dir' ? '📁' : '📄'} ${d.name}`).join('\n') ||
      'Direktori kosong atau tidak ditemukan.';
  } else {
    toolResultStr = `Tool ${toolReq.tool} tidak dikenali.`;
  }

  return { tool: toolReq.tool, path: toolReq.path, resultStr: toolResultStr };
}

export async function executeCopilotPush(
  copilotJsonStr: string,
  repoFullName: string,
  token: string,
  onProgress: (msg: string) => void
): Promise<string> {
  const pushData = JSON.parse(copilotJsonStr);
  let summary = '';

  if (!pushData.commitMessage || !Array.isArray(pushData.files)) {
    return summary;
  }

  summary += `\n\n> 🚀 **AUTONOMOUS ACTION:** Mengirim ${pushData.files.length} berkas...`;
  if (pushData.branch) {
    summary += `\n> 🌿 Membuat branch: \`${pushData.branch}\``;
    onProgress(summary);
    const defBranch = await branchApi.getDefaultBranch(repoFullName, token);
    const baseSha = await branchApi.getBranchSha(repoFullName, defBranch, token);
    await branchApi.createBranch(repoFullName, pushData.branch, baseSha, token).catch(() => null);
  }

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

  summary += `\n> ✅ **ACTION SUCCESS:** Commit berhasil.`;

  if (pushData.createPr && pushData.branch) {
    summary += `\n> 🔀 Membuka Pull Request...`;
    onProgress(summary);
    const defBranch = await branchApi.getDefaultBranch(repoFullName, token);
    const prRes = await branchApi.createPullRequest(
      repoFullName,
      pushData.createPr.title || pushData.commitMessage,
      pushData.branch,
      defBranch,
      pushData.createPr.body || '',
      token
    );
    summary += `\n> 🎉 **PR DIBUAT:** [Lihat Pull Request](${prRes.html_url})`;
  }

  return summary;
}
