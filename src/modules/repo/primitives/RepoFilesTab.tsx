import React, { useState } from 'react';
import { RepoFileExplorer } from './RepoFileExplorer';
import { RepoCodeEditor } from './RepoCodeEditor';

interface RepoFilesTabProps {
  repoFullName: string;
}

export function RepoFilesTab({ repoFullName }: RepoFilesTabProps) {
  const [targetFile, setTargetFile] = useState<{ path: string; isNew?: boolean } | null>(null);

  if (targetFile) {
    return (
      <RepoCodeEditor
        repoFullName={repoFullName}
        filePath={targetFile.path}
        isNewFile={targetFile.isNew}
        onBack={() => setTargetFile(null)}
      />
    );
  }

  return (
    <RepoFileExplorer
      repoFullName={repoFullName}
      onSelectFile={(path, isNew) => setTargetFile({ path, isNew })}
    />
  );
}
