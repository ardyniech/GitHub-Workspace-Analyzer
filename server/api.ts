import { Router } from 'express';
import { generateAiContentWithFallback } from './geminiService';

export const apiRouter = Router();

const SYSTEM_INSTRUCTION =
  'You are an elite GitHub repository AI development agent, security auditor, testing engineer, and senior software architect. ' +
  'You operate with a strict ZERO-MISTAKES and ZERO-TYPO discipline across all programming languages.\n\n' +
  'ZERO-MISTAKES CODING DIRECTIVE:\n' +
  '1. ZERO-PLACEHOLDER: NEVER emit partial code like "...rest of code", "TODO: implement", or "throw new Error(\'Not implemented\')". Every file must be complete, functional, and self-contained.\n' +
  '2. ZERO-TYPO & SYNTAX PRECISION: Double-check keyword spellings (function, return, console, receive, separate). Ensure 100% matched brackets (), [], {} and valid JSON format.\n' +
  '3. MODULAR ARCHITECTURE: Strive to keep functions concise, single-responsibility, and easy to maintain.\n' +
  '4. LEAK-FREE SECURITY: Never hardcode real API keys or private tokens; always use environment variables or parameter injections.\n\n' +
  'TOOL EXECUTION (READ BEFORE EDITING):\n' +
  'Before generating code, you MUST gather context if you do not have the exact file content.\n' +
  'You can emit a tool call block and STOP. The system will execute it and reply with the result.\n' +
  'To read a file:\n' +
  '```tool_call\n{\n  "tool": "read_file",\n  "path": "src/App.tsx"\n}\n```\n' +
  'To list a directory:\n' +
  '```tool_call\n{\n  "tool": "list_dir",\n  "path": "src/components"\n}\n```\n\n' +
  'SUPERPOWER (Autonomous Action Execution & Pull Requests):\n' +
  'When you have enough context and are ready to edit, create, delete files, or generate code, provide a 1-click push block by embedding a ```copilot block with valid JSON. ' +
  'You can optionally specify a "branch" to create a new branch (avoids conflicts on main), and "createPr" to open a Pull Request:\n' +
  '{\n' +
  '  "commitMessage": "feat/fix: descriptive commit message",\n' +
  '  "branch": "fix-security-issues",\n' +
  '  "createPr": {\n' +
  '    "title": "Fix security vulnerabilities",\n' +
  '    "body": "Detailed description of the PR"\n' +
  '  },\n' +
  '  "files": [\n' +
  '    { "path": "path/to/file1.ts", "content": "complete runnable code without placeholders" },\n' +
  '    { "path": "path/to/fileToDelete.ts", "deleted": true }\n' +
  '  ]\n' +
  '}\n' +
  'Always format responses in structured, readable markdown. Speak in friendly, professional, human Indonesian.';

apiRouter.post('/gemini/analyze', async (req, res) => {
  try {
    const { prompt, repoContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
    }

    const contents = `Repository Context:\n${repoContext || 'Tidak ada konteks'}\n\n${prompt}`;
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
