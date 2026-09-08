import React, { useState, useEffect } from 'react';
import { commitApi, CommitDetail } from '../storage/commitApi';
import { CommitPatchViewer } from './CommitPatchViewer';
import { CommitDetailBanner } from './CommitDetailBanner';
import { useAuth } from '../../auth';
import { GitCommit, X, Loader2 } from 'lucide-react';

interface CommitDiffModalProps {
  repoFullName: string;
  sha: string;
  onClose: () => void;
}

export function CommitDiffModal({ repoFullName, sha, onClose }: CommitDiffModalProps) {
  const { token } = useAuth();
  const [detail, setDetail] = useState<CommitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    commitApi
      .fetchCommitDetail(repoFullName, sha, token)
      .then((data) => isMounted && setDetail(data))
      .catch((err) => isMounted && setError(err.message || 'Gagal memuat detail commit.'))
      .finally(() => isMounted && setLoading(false));

    return () => { isMounted = false; };
  }, [repoFullName, sha, token]);

  const shortSha = sha.substring(0, 7);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 bg-zinc-900 text-white rounded-md shrink-0">
              <GitCommit className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-zinc-900 truncate">Perbandingan Kode Commit ({shortSha})</h3>
              <p className="text-[10px] text-zinc-500 truncate">{repoFullName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
              <span className="text-xs">Memuat riwayat perubahan kode...</span>
            </div>
          ) : error ? (
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
          ) : detail ? (
            <>
              <CommitDetailBanner detail={detail} />
              <div className="flex flex-col gap-2.5">
                {detail.files && detail.files.length > 0 ? (
                  detail.files.map((file) => <CommitPatchViewer key={file.filename} file={file} />)
                ) : (
                  <p className="text-xs text-zinc-400 text-center py-4">Tidak ada berkas teks yang diubah.</p>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
