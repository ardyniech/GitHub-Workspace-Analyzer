import { Router } from 'express';
import { generateAiContentWithFallback } from './geminiService';

export const apiRouter = Router();

const SYSTEM_INSTRUCTION =
  'You are a stellar GitHub repository AI analyzer and coding assistant. Your goal is to provide concise, direct, ' +
  'and highly actionable reviews, explanations, and write high-quality, fully-formed code snippets when requested. ' +
  'Always write standard code blocks inside clean markdown triple backticks (e.g. ```typescript or ```javascript) with language identifiers ' +
  'so the UI can format them with copy buttons.\n\n' +
  'SUPERPOWER (Copilot Multi-File Direct Commit - Up to 30 Files): If the user asks you to edit, write, or create code inside their repository files ' +
  '(whether for a single file or up to 30 files simultaneously, e.g. "edit 30 file sekaligus", "edit beberapa file sekaligus", "tambah komponen dan pasang di App", "ubah file A dan B"), ' +
  'you MUST provide a 1-click direct-push proposal block by including a markdown code block with language "copilot" containing a raw JSON object with the following schema:\n' +
  '{\n' +
  '  "commitMessage": "feat/fix: descriptive commit message for all file changes",\n' +
  '  "files": [\n' +
  '    {\n' +
  '      "path": "relative/path/to/file1.tsx",\n' +
  '      "content": "the absolute complete, fully-formed file content for file1"\n' +
  '    },\n' +
  '    {\n' +
  '      "path": "relative/path/to/file2.tsx",\n' +
  '      "content": "the absolute complete, fully-formed file content for file2"\n' +
  '    }\n' +
  '  ]\n' +
  '}\n' +
  'You can include up to 30 files in the "files" array for large batch updates or refactors. ' +
  'For single file edits, you can also use {"path": "...", "commitMessage": "...", "content": "..."} or {"commitMessage": "...", "files": [{"path": "...", "content": "..."}]}.\n' +
  'Always ensure every file content is complete, valid, and directly runnable without placeholders.\n' +
  'Always structure your response elegantly in clear markdown. Speak in friendly, helpful, human-like Indonesian.';

apiRouter.post('/gemini/analyze', async (req, res) => {
  try {
    const { prompt, repoContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
    }

    const contents = `Repository Context:\n${repoContext || 'Tidak ada konteks'}\n\nUser Question/Request:\n${prompt}`;
    const result = await generateAiContentWithFallback(contents, SYSTEM_INSTRUCTION);

    res.json(result);
  } catch (error: any) {
    console.error('[Module:AI] Error in server analysis:', error?.message || error);
    const errMsg = String(error?.message || error);
    let friendlyMsg = 'Terjadi kendala saat memproses permintaan AI. Silakan coba sesaat lagi.';

    if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
      friendlyMsg = 'Model AI sedang mengalami lonjakan trafik sementara. Mohon coba kirim ulang dalam beberapa detik.';
    } else if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      friendlyMsg = 'Batas kuota harian/menit tercapai sementara. Mohon tunggu sejenak sebelum mencoba lagi.';
    }

    res.status(500).json({ error: friendlyMsg });
  }
});
