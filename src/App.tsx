import React, { useState, useEffect } from 'react';
import { loadAllModules } from './core/loader';
import { RepoSelector, RepoDetail, CommitHistory, Repository, repoApi } from './modules/repo';
import { IssueCreator } from './modules/issue';
import { AiChat } from './modules/ai';
import { WeeklyActivityCard, IssuePriorityMatrixCard } from './modules/analytics';
import { DevConsoleToggle } from './modules/devConsole';
import { RepoTabsCard } from './components/RepoTabsCard';
import { AiAgentDashboard } from './components/AiAgentDashboard';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { AppHeader } from './components/AppHeader';
import { Card } from './shared/atoms/Card';
import { EmptyState } from './shared/atoms/EmptyState';
import { FolderGit2 } from 'lucide-react';
import { localCacheManager } from './shared/utils/localCache';

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
    const cachedReadme = localCacheManager.getReadme(selectedRepo.full_name);
    if (cachedReadme) {
      setReadmeText(cachedReadme);
    }
    repoApi
      .fetchReadme(selectedRepo.full_name)
      .then((text) => {
        setReadmeText(text);
        localCacheManager.saveReadme(selectedRepo.full_name, text);
      })
      .catch(() => {
        if (!cachedReadme) {
          setReadmeText('');
        }
      });
  }, [selectedRepo]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-50/50 text-zinc-900 font-sans flex flex-col antialiased">
      <AppHeader repoFullName={selectedRepo?.full_name} />

      {/* Main Board */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Side: Repositories, Issue creation & Priority Matrix */}
        <section className="md:col-span-4 flex flex-col gap-4">
          <Card title="Repositori Saya" subtitle="Pilih atau cari repositori publik">
            <RepoSelector selectedRepo={selectedRepo} onSelect={setSelectedRepo} />
          </Card>

          {selectedRepo && (
            <>
              <WeeklyActivityCard repoFullName={selectedRepo.full_name} />
              <IssuePriorityMatrixCard repoFullName={selectedRepo.full_name} />
              <Card title="Kelola Issue" subtitle="Laporkan kendala rilis atau fitur baru">
                <IssueCreator repoFullName={selectedRepo.full_name} />
              </Card>
            </>
          )}
        </section>

        {/* Right Side: Detailed analysis, Files & Chat */}
        <section className="md:col-span-8 flex flex-col gap-4 min-w-0">
          {selectedRepo ? (
            <>
              <AiAgentDashboard repoFullName={selectedRepo.full_name} />
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
            </>
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

      {/* Floating Developer Console Toggle Button */}
      <DevConsoleToggle />
    </div>
  </ErrorBoundary>
);
}
