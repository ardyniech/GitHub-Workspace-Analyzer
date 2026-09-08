import { fileApi } from './fileApi';
import { gitTreeApi, RepoTreeEntry } from './gitTreeApi';

const CRITICAL_MANIFESTS = [
  'package.json',
  'tsconfig.json',
  'Cargo.toml',
  'go.mod',
  'requirements.txt',
  'pom.xml',
  'build.gradle',
  'Dockerfile',
  'docker-compose.yml',
  '.env.example',
  'vite.config.ts',
  'next.config.js',
];

const CODE_KEYWORDS = ['App', 'main', 'index', 'server', 'router', 'auth', 'api'];

export async function extractDeepRepoContext(
  fullName: string,
  token?: string | null
): Promise<string> {
  try {
    const { tree } = await gitTreeApi.fetchRecursiveTree(fullName, token);
    let allPaths: string[] = [];

    if (tree.length > 0) {
      allPaths = tree.map((t) => `${t.type === 'tree' ? '📁' : '📄'} ${t.path}`);
    } else {
      const rootContents = await fileApi.fetchContents(fullName, '', token);
      allPaths = rootContents.map((item) => `${item.type === 'dir' ? '📁' : '📄'} ${item.name}`);
    }

    const manifestFiles = (tree.length > 0 ? tree : [])
      .filter((t) => t.type === 'blob' && CRITICAL_MANIFESTS.some((m) => t.path.endsWith(m)))
      .slice(0, 6);

    const keySourceFiles = (tree.length > 0 ? tree : [])
      .filter(
        (t) =>
          t.type === 'blob' &&
          !t.path.includes('node_modules') &&
          !t.path.includes('dist') &&
          CODE_KEYWORDS.some((kw) => t.path.toLowerCase().includes(kw.toLowerCase())) &&
          (t.path.endsWith('.ts') || t.path.endsWith('.tsx') || t.path.endsWith('.py') || t.path.endsWith('.go'))
      )
      .slice(0, 4);

    const filesToRead = [...manifestFiles, ...keySourceFiles].slice(0, 8);

    const fileContentPromises = filesToRead.map(async (file) => {
      try {
        if (!token) return { path: file.path, content: '' };
        const data = await fileApi.fetchFileContent(fullName, file.path, token);
        return { path: file.path, content: data.content.slice(0, 2500) };
      } catch {
        return { path: file.path, content: '' };
      }
    });

    const fileContents = await Promise.all(fileContentPromises);

    let contextStr = `\n--- POHON STRUKTUR HIERARKI LENGKAP REPOSITORI (${allPaths.length} Berkas/Folder) ---\n`;
    contextStr += allPaths.slice(0, 120).join('\n') + (allPaths.length > 120 ? `\n...dan ${allPaths.length - 120} berkas lainnya` : '') + '\n';

    fileContents.forEach((f) => {
      if (f.content) {
        contextStr += `\n--- BERKAS KUNCI REPOSITORI: ${f.path} ---\n${f.content}\n`;
      }
    });

    return contextStr;
  } catch (err: any) {
    console.error(`[Module:Repo] Error in extractDeepRepoContext: ${err?.message || err}`);
    return '';
  }
}
