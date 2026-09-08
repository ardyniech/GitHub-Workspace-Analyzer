import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
const modelCooldownMap = new Map<string, number>();

export function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }
  return aiClient;
}

// Model fallback cascade for high availability
export const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];

export async function generateAiContentWithFallback(
  contents: string,
  systemInstruction: string
): Promise<{ text: string; model: string }> {
  const ai = getAiClient();
  const now = Date.now();
  let lastError: any = null;

  // Filter model yang tidak sedang cooldown
  const activeModels = CANDIDATE_MODELS.filter((m) => {
    const coolUntil = modelCooldownMap.get(m) || 0;
    return now >= coolUntil;
  });

  const modelsToTry = activeModels.length > 0 ? activeModels : CANDIDATE_MODELS;

  for (const modelName of modelsToTry) {
    // Retry up to 2 attempts for transient 503/429
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 32768,
          },
        });

        if (result && result.text) {
          modelCooldownMap.delete(modelName);
          return { text: result.text, model: modelName };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('429') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('quota');

        if (isTransient) {
          modelCooldownMap.set(modelName, Date.now() + 45_000);
          if (attempt === 0) {
            // Short exponential backoff before next attempt/model
            await new Promise((resolve) => setTimeout(resolve, 800));
            continue;
          }
        }
        break; // Lanjut ke model kandidat berikutnya di fallback cascade
      }
    }
  }

  throw lastError || new Error('Semua model AI sedang sibuk. Silakan coba sesaat lagi.');
}
