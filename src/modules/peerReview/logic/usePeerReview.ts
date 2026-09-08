import { useState } from 'react';
import { useAuth } from '../../auth';
import { dispatcher } from '../../../core/dispatcher';
import { peerReviewApi } from '../storage/api';
import { reviewCodeWithAi } from './peerReviewEngine';
import { PeerReviewReport } from './types';

export function usePeerReview(repoFullName: string) {
  const { token } = useAuth();
  const [report, setReport] = useState<PeerReviewReport | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState('');

  const reviewPullRequest = async (prNumber: number) => {
    if (!repoFullName) return;
    setReviewing(true);
    setError('');

    dispatcher.emit('notify:push', {
      type: 'info',
      title: 'AI Peer Review Dimulai',
      message: `Menganalisis Pull Request #${prNumber} untuk deteksi bug & kepatuhan gaya...`,
    });

    try {
      const prDetail = await peerReviewApi.fetchPrDiff(repoFullName, prNumber, token);
      const rep = await reviewCodeWithAi(
        'pull_request',
        `PR #${prNumber}: ${prDetail.title}`,
        prDetail.diff || prDetail.body || 'Tidak ada diff',
        `Deskripsi PR: ${prDetail.body}`
      );
      setReport(rep);

      dispatcher.emit('notify:push', {
        type: rep.overallStatus === 'approved' ? 'success' : 'warning',
        title: 'AI Peer Review Selesai',
        message: `PR #${prNumber} mendapatkan status: ${rep.overallStatus.toUpperCase()} (Skor: ${rep.score}/100).`,
      });
    } catch (err: any) {
      console.error('[Module:PeerReview] Error in reviewPullRequest:', err);
      const errMsg = err.message || 'Gagal memproses peer review pada Pull Request.';
      setError(errMsg);
      dispatcher.emit('notify:push', {
        type: 'error',
        title: 'Peer Review Gagal',
        message: errMsg,
      });
    } finally {
      setReviewing(false);
    }
  };

  const reviewFileCode = async (filePath: string, content: string) => {
    setReviewing(true);
    setError('');
    try {
      const rep = await reviewCodeWithAi('file_edit', filePath, content);
      setReport(rep);
      return rep;
    } catch (err: any) {
      console.error('[Module:PeerReview] Error in reviewFileCode:', err);
      setError(err.message || 'Gagal mereview kode.');
      return null;
    } finally {
      setReviewing(false);
    }
  };

  return {
    report,
    reviewing,
    error,
    reviewPullRequest,
    reviewFileCode,
    clearReport: () => setReport(null),
  };
}
