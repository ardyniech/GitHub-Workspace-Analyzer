import { fileApi } from './fileApi';

export interface RepoDeepContext {
  fileTree: string[];
  manifests: Record<string, string>;
  recentFiles: { path: string; snippet: string }[];
}

const CRITICAL_MANIFESTS = [
  'package.json',
  'tsconfig.json',
  'Cargo.toml',
  'go.mod',
  'requirements.txt',
  'pom.xml',
  'build.gradle',
  'Dockerfile',
  '.env.example',
];

export async function extractDeepRepoContext(
  fullName: string,
  token?: string | null
): Promise<string> {
  try {
    const rootContents = await fileApi.fetchContents(fullName, '', token);
    const fileList = rootContents.map((item) => `${item.type === 'dir' ? '📁' : '📄'} ${item.name}`);

    const manifestPromises = rootContents
      .filter((item) => item.type === 'file' && CRITICAL_MANIFESTS.includes(item.name))
      .slice(0, 4)
      .map(async (item) => {
        try {
          if (!token) return { path: item.name, content: '' };
          const data = await fileApi.fetchFileContent(fullName, item.path, token);
          return { path: item.name, content: data.content.slice(0, 1500) };
        } catch {
          return { path: item.name, content: '' };
        }
      });

    const manifests = await Promise.all(manifestPromises);
    let contextStr = `\n--- STRUKTUR BERKAS REAL-TIME REPOSITORI ---\n${fileList.join('\n')}\n`;

    manifests.forEach((m) => {
      if (m.content) {
        contextStr += `\n--- ISI MANIFEST AKTIF: ${m.path} ---\n${m.content}\n`;
      }
    });

    return contextStr;
  } catch (err: any) {
    console.error(`[Module:Repo] Error extracting deep context: ${err?.message || err}`);
    return '';
  }
}
