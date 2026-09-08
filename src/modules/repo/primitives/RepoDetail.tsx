import React, { useState, useEffect } from 'react';
import { Repository, repoApi } from '../storage/api';
import { useAuth } from '../../auth/logic/useAuth';
import { Card } from '../../../shared/atoms/Card';
import { Badge } from '../../../shared/atoms/Badge';
import { Loading } from '../../../shared/atoms/Loading';
import { BookOpen } from 'lucide-react';

interface RepoDetailProps {
  repo: Repository;
}

export function RepoDetail({ repo }: RepoDetailProps) {
  const { token } = useAuth();
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const loadReadme = async () => {
      setLoading(true);
      try {
        const text = await repoApi.fetchReadme(repo.full_name, token);
        if (active) setReadme(text);
      } catch (e) {
        if (active) setReadme('Gagal memuat README.');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadReadme();
    return () => {
      active = false;
    };
  }, [repo, token]);

  return (
    <Card title="Repositori Terpilih" subtitle={repo.full_name}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
          <Badge variant="primary">{`${repo.stargazers_count} Stars`}</Badge>
          <Badge variant="success">{`${repo.open_issues_count} Issues`}</Badge>
        </div>
        <p className="text-xs text-zinc-600 italic bg-zinc-50 border border-zinc-100 rounded-lg p-2.5">
          {repo.description || 'Tidak ada deskripsi.'}
        </p>
        <div className="border border-zinc-100 rounded-xl overflow-hidden bg-white">
          <div className="px-3 py-2 border-b border-zinc-50 bg-zinc-50/50 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
            <span>README.md</span>
          </div>
          <div className="p-3 max-h-[140px] overflow-y-auto text-xs text-zinc-600 font-mono leading-relaxed bg-zinc-50/30 whitespace-pre-wrap">
            {loading ? (
              <Loading message="Membaca README..." />
            ) : (
              readme
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
