import { Router } from 'express';
import { getRefactorCandidateFiles, readWorkspaceFileSafe, applyRefactorToWorkspace } from './refactorService';
import { analyzeAndRefactorCode } from './refactorAiService';

export const refactorRouter = Router();

refactorRouter.get('/candidates', (req, res) => {
  try {
    const candidates = getRefactorCandidateFiles();
    res.json({ candidates });
  } catch (error: any) {
    console.error('[Module:Refactor] Error in get candidates:', error?.message);
    res.status(500).json({ error: 'Gagal memindai berkas kandidat refaktor.' });
  }
});

refactorRouter.get('/read', (req, res) => {
  try {
    const filePath = req.query.path as string;
    if (!filePath) return res.status(400).json({ error: 'Path berkas tidak boleh kosong.' });
    const content = readWorkspaceFileSafe(filePath);
    res.json({ content, lines: content.split('\n').length });
  } catch (error: any) {
    console.error('[Module:Refactor] Error reading file:', error?.message);
    res.status(404).json({ error: error.message || 'Gagal membaca berkas.' });
  }
});

refactorRouter.post('/analyze', async (req, res) => {
  try {
    const { filePath, content: clientContent, goal = 'modularitas & strict typing', commitContext } = req.body;
    if (!filePath) return res.status(400).json({ error: 'Path berkas diperlukan.' });

    let originalCode = clientContent;
    if (!originalCode) {
      originalCode = readWorkspaceFileSafe(filePath);
    }

    const aiResult = await analyzeAndRefactorCode(filePath, originalCode, goal, commitContext);
    const lineCountBefore = originalCode.split('\n').length;
    const lineCountAfter = aiResult.refactoredCode.split('\n').length;

    res.json({
      id: `refactor-${Date.now()}`,
      filePath,
      lineCountBefore,
      lineCountAfter,
      ...aiResult,
    });
  } catch (error: any) {
    console.error('[Module:Refactor] Error analyzing code:', error?.message);
    res.status(500).json({ error: error.message || 'Gagal menganalisis kode untuk refaktor.' });
  }
});

refactorRouter.post('/apply', (req, res) => {
  try {
    const { filePath, refactoredCode, commitMessage } = req.body;
    if (!filePath || !refactoredCode) {
      return res.status(400).json({ error: 'filePath dan refactoredCode tidak boleh kosong.' });
    }

    const result = applyRefactorToWorkspace(filePath, refactoredCode, commitMessage);
    res.json(result);
  } catch (error: any) {
    console.error('[Module:Refactor] Error applying refactor:', error?.message);
    res.status(500).json({ error: error.message || 'Gagal menerapkan refaktor ke berkas.' });
  }
});
