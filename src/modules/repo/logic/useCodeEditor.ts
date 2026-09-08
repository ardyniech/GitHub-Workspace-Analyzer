import { useState, useEffect } from 'react';
import { repoApi } from '../storage/api';
import { dispatcher } from '../../../core/dispatcher';

export function useCodeEditor(
  repoFullName: string,
  filePath: string,
  isNewFile: boolean | undefined,
  token: string | null
) {
  const [content, setContent] = useState('');
  const [sha, setSha] = useState('');
  const [commitMsg, setCommitMsg] = useState(isNewFile ? `Create ${filePath}` : `Update ${filePath}`);
  const [loading, setLoading] = useState(!isNewFile);
  const [pushing, setPushing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');
  const [commitUrl, setCommitUrl] = useState('');

  useEffect(() => {
    if (isNewFile || !token) { setLoading(false); return; }
    setLoading(true);
    repoApi.fetchFileContent(repoFullName, filePath, token)
      .then((res) => { setContent(res.content); setSha(res.sha); })
      .catch((err) => setErrorText(err.message || 'Gagal memuat berkas'))
      .finally(() => setLoading(false));
  }, [repoFullName, filePath, token, isNewFile]);

  const executeCommit = async () => {
    if (!token) return;
    setPushing(true);
    setStatus('idle');
    try {
      const res = await repoApi.commitFile(repoFullName, filePath, content, commitMsg, token, sha || undefined);
      setStatus('success');
      setCommitUrl(res?.commit?.html_url || '');
      if (res?.content?.sha) setSha(res.content.sha);
      dispatcher.emit('repo:commit_pushed', { repoFullName, filePath });
    } catch (err: any) {
      setStatus('error');
      setErrorText(err.message || 'Gagal melakukan commit/push.');
    } finally {
      setPushing(false);
    }
  };

  return {
    content,
    setContent,
    commitMsg,
    setCommitMsg,
    loading,
    pushing,
    status,
    errorText,
    commitUrl,
    executeCommit,
  };
}
