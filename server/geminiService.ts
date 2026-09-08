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

// Model urutan utama: gemini-3.8-flash sebagai prioritas pertama
export const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
];

export async function generateAiContentWithFallback(
  contents: string,
  systemInstruction: string
): Promise<{ text: string; model: string }> {
  const ai = getAiClient();
  const now = Date.now();
  let lastError: any = null;

  // Filter model yang sedang dalam cooldown
  const availableModels = CANDIDATE_MODELS.filter((m) => {
    const coolDownUntil = modelCooldownMap.get(m) || 0;
    return now >= coolDownUntil;
  });

  const modelsToTry = availableModels.length > 0 ? availableModels : CANDIDATE_MODELS;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Module:AI] Attempting generation with ${modelName}...`);
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
        console.log(`[Module:AI] Generation succeeded using model: ${modelName}`);
        modelCooldownMap.delete(modelName);
        return { text: result.text, model: modelName };
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || err);
      console.warn(`[Module:AI] Model ${modelName} failed: ${errMsg.slice(0, 140)}`);

      // Cooldown jika terkena limit atau busy
      if (
        errMsg.includes('429') ||
        errMsg.includes('503') ||
        errMsg.includes('quota') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('high demand')
      ) {
        modelCooldownMap.set(modelName, Date.now() + 60_000);
      }
    }
  }

  throw lastError || new Error('Semua model AI sedang sibuk. Silakan coba sesaat lagi.');
}
