import { CONFIG } from '../../../core/config';

export interface AiAnalyzeResult {
  text: string;
  model?: string;
}

export const aiApi = {
  async analyzeRepo(prompt: string, repoContext: string): Promise<AiAnalyzeResult> {
    const res = await fetch(`${CONFIG.API_BASE}/gemini/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, repoContext }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Gagal terhubung dengan asisten AI.');
    }
    const data = await res.json();
    return {
      text: data.text,
      model: data.model,
    };
  }
};
