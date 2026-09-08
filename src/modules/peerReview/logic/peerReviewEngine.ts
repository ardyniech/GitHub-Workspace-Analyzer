import { aiApi } from '../../ai/storage/api';
import { runHeuristicPeerReview } from './heuristicReviewer';
import { PeerReviewReport, PeerReviewFinding } from './types';

export async function reviewCodeWithAi(
  targetType: 'pull_request' | 'file_edit' | 'diff',
  targetIdentifier: string,
  contentOrDiff: string,
  extraContext: string = ''
): Promise<PeerReviewReport> {
  const heuristicFindings = runHeuristicPeerReview(contentOrDiff, targetIdentifier);

  const prompt = `Anda adalah AI Senior Peer Reviewer berstandar Silicon Valley & Zero Mistake SOP.
Lakukan peer review mendalam terhadap kode/perubahan berikut:

Target: ${targetIdentifier} (${targetType})
Konteks Tambahan: ${extraContext || 'Perubahan kode repositori'}

KODE / DIFF UNTUK DI-REVIEW:
\`\`\`
${contentOrDiff.slice(0, 4000)}
\`\`\`

Tugas Anda:
1. Analisis Bug Logika (off-by-one, unhandled null/undefined, race conditions, memory leak).
2. Analisis Redundansi (duplicate code, dead code, unused imports, overcomplicated loops).
3. Kepatuhan Gaya & SOP (TypeScript type safety, naming conventions, zero any, clean architecture).
4. Berikan output HANYA dalam format JSON valid berikut tanpa markdown formatting tambahan di luar json block:
{
  "overallStatus": "approved" | "changes_requested" | "commented",
  "score": 85, // nilai 0-100
  "summary": "Ringkasan peer review dalam 1-3 kalimat bahasa Indonesia yang solutif dan profesional.",
  "findings": [
    {
      "category": "logic_bug" | "redundancy" | "style_convention" | "security_flaw",
      "severity": "critical" | "warning" | "suggestion" | "praise",
      "title": "Judul temuan singkat",
      "description": "Ulasan mengapa hal ini bermasalah",
      "snippet": "baris kode terkait jika ada",
      "suggestion": "Solusi perbaikan kode spesifik"
    }
  ]
}`;

  try {
    const aiRes = await aiApi.analyzeRepo(prompt, 'Peer Review Engine');
    let parsed: any = null;

    const jsonMatch = aiRes.text.match(/```json([\s\S]*?)```/) || aiRes.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const rawJson = jsonMatch[1] || jsonMatch[0];
      parsed = JSON.parse(rawJson.trim());
    }

    const aiFindings: PeerReviewFinding[] = (parsed?.findings || []).map((f: any, idx: number) => ({
      id: `ai-finding-${idx}`,
      category: f.category || 'logic_bug',
      severity: f.severity || 'warning',
      title: f.title || 'Temuan AI Reviewer',
      description: f.description || '',
      snippet: f.snippet,
      suggestion: f.suggestion,
    }));

    // Merge static heuristics + AI analysis
    const combinedFindings = [...heuristicFindings, ...aiFindings];
    const score = typeof parsed?.score === 'number' ? parsed.score : Math.max(20, 100 - combinedFindings.length * 15);
    const overallStatus =
      combinedFindings.some((f) => f.severity === 'critical')
        ? 'changes_requested'
        : score >= 80
        ? 'approved'
        : 'commented';

    return {
      id: `review-${Date.now()}`,
      title: `Peer Review: ${targetIdentifier}`,
      targetType,
      targetIdentifier,
      overallStatus,
      score,
      summary: parsed?.summary || 'Peer review selesai. Silakan periksa temuan dan rekomendasi perbaikan sebelum melakukan merge.',
      findings: combinedFindings,
      timestamp: Date.now(),
    };
  } catch (err: any) {
    console.error('[Module:PeerReview] Error in reviewCodeWithAi:', err);
    return {
      id: `review-fallback-${Date.now()}`,
      title: `Peer Review: ${targetIdentifier}`,
      targetType,
      targetIdentifier,
      overallStatus: heuristicFindings.some((f) => f.severity === 'critical') ? 'changes_requested' : 'approved',
      score: Math.max(30, 100 - heuristicFindings.length * 15),
      summary: 'Analisis statis heuristik selesai (fallback). Kode siap diperiksa secara manual.',
      findings: heuristicFindings,
      timestamp: Date.now(),
    };
  }
}
