import React, { useEffect, useRef } from 'react';
import { useCommitActivity } from '../logic/useCommitActivity';
import { renderWeeklyActivityChart } from './d3ActivityChart';
import { useAuth } from '../../auth';
import { Card } from '../../../shared/atoms/Card';
import { Activity, RefreshCw, BarChart2 } from 'lucide-react';

interface WeeklyActivityCardProps {
  repoFullName: string;
}

export function WeeklyActivityCard({ repoFullName }: WeeklyActivityCardProps) {
  const { token } = useAuth();
  const { data, loading, error, reload } = useCommitActivity(repoFullName, token);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;
    const width = containerRef.current.clientWidth || 380;
    renderWeeklyActivityChart(svgRef.current, data, width, 160);
  }, [data]);

  const totalCommitsYear = data.reduce((acc, curr) => acc + curr.total, 0);
  const recentWeeks = data.slice(-4);
  const recentCommits = recentWeeks.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <Card
      title="Aktivitas & Tren Mingguan"
      subtitle="Visualisasi frekuensi commit mingguan menggunakan D3.js"
      headerAction={
        <button
          onClick={reload}
          disabled={loading}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          title="Segarkan data aktivitas"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        {/* KPI Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-100 text-purple-700">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-medium">4 Minggu Terakhir</p>
              <p className="text-xs font-bold text-zinc-900">{recentCommits} Commit</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-medium">Total 1 Tahun</p>
              <p className="text-xs font-bold text-zinc-900">{totalCommitsYear} Commit</p>
            </div>
          </div>
        </div>

        {/* D3 SVG Chart */}
        <div ref={containerRef} className="w-full relative min-h-[160px] flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-2xs z-10">
              <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin text-purple-600" /> Memuat data D3.js...
              </span>
            </div>
          )}

          {error ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              Data aktivitas belum tersedia atau sedang dikalkulasi oleh GitHub.
            </div>
          ) : data.length === 0 && !loading ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              Belum ada data aktivitas commit tercatat untuk repositori ini.
            </div>
          ) : (
            <svg ref={svgRef} className="w-full h-[160px] overflow-visible" />
          )}
        </div>
      </div>
    </Card>
  );
}
