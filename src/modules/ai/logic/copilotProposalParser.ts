export interface CopilotFile {
  path: string;
  content: string;
}

export interface ParsedProposal {
  commitMessage: string;
  files: CopilotFile[];
  isValid: boolean;
}

export function parseCopilotProposal(raw: string): ParsedProposal {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { commitMessage: '', files: [], isValid: false };
  }

  try {
    const parsed = JSON.parse(trimmed);

    // Format 1: { commitMessage: string, files: Array<{ path, content }> }
    if (parsed && Array.isArray(parsed.files) && parsed.files.length > 0) {
      const validFiles = parsed.files
        .filter((f: any) => f && typeof f.path === 'string' && typeof f.content === 'string')
        .map((f: any) => ({ path: f.path.trim(), content: f.content }));

      if (validFiles.length > 0) {
        return {
          commitMessage: parsed.commitMessage || `feat: update ${validFiles.length} files via AI Copilot`,
          files: validFiles,
          isValid: true,
        };
      }
    }

    // Format 2: Array of [{ path, content, commitMessage? }]
    if (Array.isArray(parsed) && parsed.length > 0) {
      const validFiles = parsed
        .filter((f: any) => f && typeof f.path === 'string' && typeof f.content === 'string')
        .map((f: any) => ({ path: f.path.trim(), content: f.content }));

      if (validFiles.length > 0) {
        return {
          commitMessage: parsed[0]?.commitMessage || `feat: update ${validFiles.length} files via AI Copilot`,
          files: validFiles,
          isValid: true,
        };
      }
    }

    // Format 3: Single file { path, commitMessage, content }
    if (parsed && typeof parsed.path === 'string' && typeof parsed.content === 'string') {
      return {
        commitMessage: parsed.commitMessage || `Update ${parsed.path} via AI Copilot`,
        files: [{ path: parsed.path.trim(), content: parsed.content }],
        isValid: true,
      };
    }
  } catch {
    // Fallback: Regex extraction for lenient parsing
    const pMatches = [...trimmed.matchAll(/"path"\s*:\s*"([^"]+)"/g)];
    const cMatches = [...trimmed.matchAll(/"content"\s*:\s*"([\s\S]+?)"\s*(?:,|\}|\])/g)];
    const mMatch = trimmed.match(/"commitMessage"\s*:\s*"([^"]+)"/);

    if (pMatches.length > 0 && cMatches.length > 0) {
      const files: CopilotFile[] = [];
      const count = Math.min(pMatches.length, cMatches.length);
      for (let i = 0; i < count; i++) {
        files.push({
          path: pMatches[i][1].trim(),
          content: cMatches[i][1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
        });
      }
      return {
        commitMessage: mMatch ? mMatch[1] : `feat: update ${files.length} files via AI Copilot`,
        files,
        isValid: files.length > 0,
      };
    }
  }

  return { commitMessage: '', files: [], isValid: false };
}
