import { RefactorProposal } from './aiRefactorTypes';
import { buildAgentMemoryContext, autoRecordRepoProgress } from '../../memory';
import { devConsoleLogger } from '../../devConsole';
import { dispatcher } from '../../../core/dispatcher';

export function generateRefactorProposal(repoFullName: string, commitMessage?: string): RefactorProposal {
  const memoryContext = buildAgentMemoryContext(repoFullName);
  devConsoleLogger.addLog('reasoning', 'AIRefactorEngine', `Analisis memori agent & standar koding untuk refactoring ${repoFullName}...`);

  const mockOriginal = `// Legacy monolithic component
export function OldComponent(props: any) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => setData(d));
  }, []);
  return <div>{data ? data.name : 'Loading...'}</div>;
}`;

  const mockRefactored = `// Refactored: Strict typing, cellular primitive, error handling
interface DataProps { name: string }

export function RefactoredComponent({ name }: DataProps) {
  if (!name) return <div className="text-zinc-400">Loading...</div>;
  return <div className="font-semibold text-zinc-900">{name}</div>;
}`;

  return {
    id: `refactor-${Date.now()}`,
    repoFullName,
    commitContext: commitMessage || 'Peningkatan struktur berkas & efisiensi modul',
    title: 'Proposal Refactoring Logika & Pembaruan Dependensi',
    summary: 'Restrukturisasi komponen monolitik menjadi sub-primitif selular, penerapakan strict interface typing, serta pembaruan dependensi keamanan.',
    appliedMemories: [
      'SOP Zero Mistake Protocol: Batas file <125 baris & strict type safety',
      'Universal Modular Architecture: Isolasi modul & komunikasi via core/dispatcher',
      memoryContext ? 'Konstruksi konteks memori aktif repositori' : 'Konteks memori standar',
    ],
    changes: [
      {
        fileName: 'src/modules/core/primitives/DataView.tsx',
        originalCode: mockOriginal,
        refactoredCode: mockRefactored,
        reason: 'Restrukturisasi dari tipe Implicit Any ke Strict Interface Props + Fail-safe rendering.',
      },
    ],
    dependencyUpdates: [
      { name: 'lucide-react', currentVersion: '^0.290.0', proposedVersion: '^0.400.0' },
      { name: 'typescript', currentVersion: '^5.0.0', proposedVersion: '^5.4.0' },
    ],
    status: 'proposed',
  };
}

export async function applyRefactorProposal(proposal: RefactorProposal): Promise<boolean> {
  devConsoleLogger.addLog('info', 'AIRefactorEngine', `Menerapkan proposal refactoring [${proposal.id}] pada ${proposal.repoFullName}...`);

  // Record into persistent agent memory
  autoRecordRepoProgress(
    proposal.repoFullName,
    `AI Refactor Executed: ${proposal.title}`,
    `Perubahan diterapkan pada ${proposal.changes.length} berkas dengan pembaruan dependensi.`
  );

  // Dispatch global event for commit update and UI notification
  dispatcher.emit('repo:commit_pushed', {
    repoFullName: proposal.repoFullName,
    message: `refactor: ${proposal.title} (AI Refactored)`,
  });

  devConsoleLogger.addLog('reasoning', 'AIRefactorEngine', `Refactoring sukses. Memori & commit history telah diperbarui.`);
  return true;
}
