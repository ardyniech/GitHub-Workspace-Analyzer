import React, { useState, useEffect } from 'react';
import { loadAllModules } from './core/loader';
import { AuthPanel } from './modules/auth';
import { RepoSelector, RepoDetail, CommitHistory, Repository, repoApi } from './modules/repo';
import { IssueCreator } from './modules/issue';
import { AiChat } from './modules/ai';
import { WeeklyActivityCard } from './modules/analytics';
import { RepoTabsCard } from './components/RepoTabsCard';
import { Card } from './shared/atoms/Card';
import { EmptyState } from './shared/atoms/EmptyState';
import { Github, FolderGit2 } from 'lucide-react';

export default function App() {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [readmeText, setReadmeText] = useState('');

  useEffect(() => {
    loadAllModules();
  }, []);

  useEffect(() => {
    if (!selectedRepo) {
      setReadmeText('');
      return;
    }
    repoApi
      .fetchReadme(selectedRepo.full_name)
      .then((text) => setReadmeText(text))
      .catch(() => setReadmeText(''));
  }, [selectedRepo]);

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 font-sans flex flex-col antialiased">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-900 rounded-lg text-white">
            <Github className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="font-bold text-sm tracking-tight leading-none">GitHub Workspace Analyzer</h1>
            <p className="text-[10px] text-zinc-500 font-medium leading-none">
              Asisten Cerdas Pengembangan Kode & Copilot Gemini 3.8 Flash
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AuthPanel />
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Side: Repositories & Issue creation */}
        <section className="md:col-span-4 flex flex-col gap-4">
          <Card title="Repositori Saya" subtitle="Pilih atau cari repositori publik">
            <RepoSelector selectedRepo={selectedRepo} onSelect={setSelectedRepo} />
          </Card>

          {selectedRepo && (
            <>
              <WeeklyActivityCard repoFullName={selectedRepo.full_name} />
              <Card title="Kelola Issue" subtitle="Laporkan kendala rilis atau fitur baru">
                <IssueCreator repoFullName={selectedRepo.full_name} />
              </Card>
            </>
          )}
        </section>

        {/* Right Side: Detailed analysis, Files & Chat */}
        <section className="md:col-span-8 flex flex-col gap-4 min-w-0">
          {selectedRepo ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 min-w-0">
                <RepoDetail repo={selectedRepo} />
                <CommitHistory repoFullName={selectedRepo.full_name} />
                <RepoTabsCard repoFullName={selectedRepo.full_name} />
              </div>
              <div className="min-w-0">
                <AiChat
                  repoFullName={selectedRepo.full_name}
                  repoDescription={selectedRepo.description}
                  readmeText={readmeText}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[350px] bg-white border border-zinc-200 rounded-xl">
              <EmptyState
                icon={FolderGit2}
                title="Silakan Pilih Repositori"
                description="Gunakan fitur pencarian repositori di sebelah kiri atau hubungkan token GitHub untuk memuat daftar repositori pribadi Anda secara instan."
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
