import { useState, useEffect, useCallback } from 'react';
import { commentApi, IssueComment } from '../storage/commentApi';
import { analyzeIssueComments } from './sentimentAnalyzer';
import { SentimentResult } from './sentimentTypes';

export function useIssueSentiment(
  repoFullName: string,
  issueNumber: number,
  initialCommentCount: number = 0,
  token?: string | null
) {
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [analysis, setAnalysis] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const loadCommentsAndAnalyze = useCallback(async () => {
    if (!repoFullName || !issueNumber) return;
    setLoading(true);
    setError('');

    try {
      if (initialCommentCount === 0) {
        const emptyResult = analyzeIssueComments([]);
        setComments([]);
        setAnalysis(emptyResult);
        return;
      }

      const data = await commentApi.fetchIssueComments(repoFullName, issueNumber, token);
      setComments(data);
      const result = analyzeIssueComments(data);
      setAnalysis(result);
    } catch (err: any) {
      console.error(`[Module:sentiment] Error in loadCommentsAndAnalyze: ${err.message || err}`);
      setError(err.message || 'Gagal memuat analisis komentar.');
    } finally {
      setLoading(false);
    }
  }, [repoFullName, issueNumber, initialCommentCount, token]);

  const toggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState && !analysis && !loading) {
      loadCommentsAndAnalyze();
    }
  };

  useEffect(() => {
    // If there are comments, perform quick analysis once if user expands or on mount
    if (isExpanded && !analysis && !loading) {
      loadCommentsAndAnalyze();
    }
  }, [isExpanded, analysis, loading, loadCommentsAndAnalyze]);

  return {
    comments,
    analysis,
    loading,
    error,
    isExpanded,
    toggleExpand,
    reload: loadCommentsAndAnalyze,
  };
}
