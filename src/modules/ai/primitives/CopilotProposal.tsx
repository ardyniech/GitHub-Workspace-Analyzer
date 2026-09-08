import React, { useState } from 'react';
import { useCopilotPush } from '../logic/useCopilotPush';
import { parseCopilotProposal } from '../logic/copilotProposalParser';
import { ProposalDiffView } from './ProposalDiffView';
import { CopilotProposalHeader } from './CopilotProposalHeader';
import { CopilotProposalActions } from './CopilotProposalActions';
import { CopilotFileTabs } from './CopilotFileTabs';
import { useSecurityScan, SecurityBadge, SecurityFindingsList, SecurityWarningModal } from '../../security';
import { runPreCommitTests, PreCommitReport, PreCommitTestModal } from '../../tester';
import { isAutoPilotEnabled } from '../storage/autoPilotStorage';
import { AlertTriangle } from 'lucide-react';

interface CopilotProposalProps {
  jsonString: string;
  repoFullName: string;
}

export function CopilotProposal({ jsonString, repoFullName }: CopilotProposalProps) {
  const proposal = parseCopilotProposal(jsonString);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDiff, setShowDiff] = useState(false);
  const [showSecurityDetail, setShowSecurityDetail] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [testReport, setTestReport] = useState<PreCommitReport | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(
    () => new Set(proposal.files.map((f) => f.path))
  );

  const { token, status, errorMessage, commitResult, progress, pushedFiles, pushAllFiles, cancelPush } =
    useCopilotPush(repoFullName);

  const activeFile = proposal.files[activeIndex] || proposal.files[0];
  const { report, scanning } = useSecurityScan(activeFile?.content || '', activeFile?.path || '');

  if (!proposal.isValid || proposal.files.length === 0) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Format usulan kode Copilot tidak valid.</span>
      </div>
    );
  }

  const filesToPush = proposal.files.filter((f) => selectedPaths.has(f.path));

  const handleInitiatePush = () => {
    if (filesToPush.length === 0) return;
    if (isAutoPilotEnabled()) {
      pushAllFiles(filesToPush, proposal.commitMessage);
      return;
    }
    const testRes = runPreCommitTests(filesToPush);
    setTestReport(testRes);
  };

  const handleConfirmPush = () => {
    setTestReport(null);
    if (report.hasCritical) {
      setShowWarningModal(true);
      return;
    }
    pushAllFiles(filesToPush, proposal.commitMessage);
  };

  const togglePath = (p: string) => {
    const next = new Set(selectedPaths);
    next.has(p) ? next.delete(p) : next.add(p);
    setSelectedPaths(next);
  };

  return (
    <div className="my-3 border-2 border-zinc-300 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
      <CopilotProposalHeader path={activeFile.path} commitMessage={proposal.commitMessage} fileCount={proposal.files.length} />
      <div className="p-3.5 flex flex-col gap-2.5">
        <CopilotFileTabs
          files={proposal.files}
          activeIndex={activeIndex}
          onSelectIndex={(idx) => { setActiveIndex(idx); setShowDiff(true); }}
          selectedPaths={selectedPaths}
          onTogglePath={togglePath}
          onToggleAll={() => setSelectedPaths(selectedPaths.size === proposal.files.length ? new Set() : new Set(proposal.files.map((f) => f.path)))}
        />
        <SecurityBadge report={report} scanning={scanning} showDetail={showSecurityDetail} onToggleDetail={() => setShowSecurityDetail(!showSecurityDetail)} />
        {showSecurityDetail && <SecurityFindingsList findings={report.findings} />}
        <CopilotProposalActions
          showDiff={showDiff}
          onToggleDiff={() => setShowDiff(!showDiff)}
          onInitiatePush={handleInitiatePush}
          onCancelPush={cancelPush}
          status={status}
          hasCritical={report.hasCritical}
          commitUrl={commitResult?.commit?.html_url}
          errorMessage={errorMessage}
          fileCount={filesToPush.length}
          progress={progress}
          pushedFiles={pushedFiles}
        />
        {showDiff && activeFile && (
          <ProposalDiffView repoFullName={repoFullName} path={activeFile.path} newContent={activeFile.content} token={token} />
        )}
      </div>
      {testReport && (
        <PreCommitTestModal report={testReport} fileCount={filesToPush.length} onConfirmPush={handleConfirmPush} onCancel={() => setTestReport(null)} />
      )}
      {showWarningModal && (
        <SecurityWarningModal findings={report.findings} onConfirmForcePush={() => { setShowWarningModal(false); pushAllFiles(filesToPush, proposal.commitMessage); }} onCancel={() => setShowWarningModal(false)} />
      )}
    </div>
  );
}
