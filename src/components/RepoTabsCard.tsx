import React, { useState } from 'react';
import { Card } from '../shared/atoms/Card';
import { RepoFilesTab, FileTreeManager } from '../modules/repo';
import { IssueList } from '../modules/issue';
import { PrList } from '../modules/pr';
import { ManifestSecurityCard } from '../modules/security';
import { FolderCode, AlertCircle, GitPullRequest, ShieldCheck, Folder } from 'lucide-react';

interface RepoTabsCardProps {
  repoFullName: string;
}

export function RepoTabsCard({ repoFullName }: RepoTabsCardProps) {
  const [activeTab, setActiveTab] = useState<'files' | 'tree' | 'issues' | 'prs' | 'deps'>('files');

  const tabs = [
    { id: 'files', label: 'Berkas & Edit', icon: FolderCode },
    { id: 'tree', label: 'File Manager', icon: Folder },
    { id: 'deps', label: 'Audit Manifes', icon: ShieldCheck },
    { id: 'issues', label: 'Issues', icon: AlertCircle },
    { id: 'prs', label: 'Pull Requests', icon: GitPullRequest },
  ] as const;

  return (
    <Card
      title={
        activeTab === 'files'
          ? 'Penjelajah Berkas & Editor'
          : activeTab === 'tree'
          ? 'Manajemen Direktori'
          : activeTab === 'deps'
          ? 'Audit Keamanan Manifes'
          : activeTab === 'issues'
          ? 'Daftar Issue Terbaru'
          : 'Pull Request Terbaru'
      }
      subtitle={
        activeTab === 'files'
          ? 'Buka file untuk diedit dan push langsung ke GitHub'
          : activeTab === 'tree'
          ? 'Buat, Hapus, dan Ubah Nama File'
          : activeTab === 'deps'
          ? 'Pemeriksaan package.json & requirements.txt dengan AI Gemini'
          : activeTab === 'issues'
          ? 'Issue yang belum terselesaikan'
          : 'PR aktif dan riwayat kontribusi'
      }
      headerAction={
        <div className="flex bg-zinc-100 p-0.5 rounded-lg text-[10.5px] font-semibold gap-0.5 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive ? 'bg-white shadow-xs text-zinc-900 font-bold' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      }
    >
      {activeTab === 'files' && <RepoFilesTab repoFullName={repoFullName} />}
      {activeTab === 'tree' && <FileTreeManager repoFullName={repoFullName} />}
      {activeTab === 'deps' && <ManifestSecurityCard repoFullName={repoFullName} />}
      {activeTab === 'issues' && <IssueList repoFullName={repoFullName} />}
      {activeTab === 'prs' && <PrList repoFullName={repoFullName} />}
    </Card>
  );
}
