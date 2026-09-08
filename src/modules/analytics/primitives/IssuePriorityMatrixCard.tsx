import React, { useRef, useEffect, useState } from 'react';
import { useIssuePriorityMatrix } from '../logic/useIssuePriorityMatrix';
import { IssuePriorityItem } from '../logic/priorityTypes';
import { renderPriorityMatrixChart } from './d3PriorityMatrixChart';
import { Card } from '../../../shared/atoms/Card';
import { Loading } from '../../../shared/atoms/Loading';
import { LayoutGrid, CheckCircle2, AlertCircle } from 'lucide-react';

interface IssuePriorityMatrixCardProps {
  repoFullName: string;
}

export function IssuePriorityMatrixCard({ repoFullName }: IssuePriorityMatrixCardProps) {
  const { data, loading, error } = useIssuePriorityMatrix(repoFullName);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssuePriorityItem | null>(null);

  useEffect(() => {
    if (!data?.items || !svgRef.current || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width } = entries[0].contentRect;
      if (width > 50 && svgRef.current) {
        renderPriorityMatrixChart(svgRef.current, data.items, width, 220, setSelectedIssue);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [data]);

  return (
    <Card
      title="Matriks Prioritas Issue (D3.js)"
      subtitle="Pemetaan beban kerja berdasarkan urgensi & dampak fitur"
    >
      <div className="flex flex-col gap-2.5">
        {loading && <Loading message="Menganalisis matriks prioritas issue..." />}
        {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}

        {!loading && data && (
          <>
            {/* Quadrant Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
              <div className="p-1.5 rounded-lg bg-red-50 text-red-800 border border-red-200 font-medium">
                🔥 Major: {data.majorProjects}
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                ⚡ Quick Wins: {data.quickWins}
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                ⚠️ Thankless: {data.thanklessTasks}
              </div>
              <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium">
                📋 Fill-ins: {data.fillIns}
              </div>
            </div>

            {/* D3 Canvas Container */}
            <div ref={containerRef} className="w-full bg-white rounded-lg border border-zinc-100 overflow-hidden">
              <svg ref={svgRef} className="w-full h-[220px]" />
            </div>

            {/* Selected Issue Preview */}
            {selectedIssue ? (
              <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs flex flex-col gap-1 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 truncate">
                    #{selectedIssue.number} {selectedIssue.title}
                  </span>
                  <span className="text-[9.5px] px-1.5 py-0.5 rounded font-mono font-semibold bg-zinc-200 text-zinc-800">
                    {selectedIssue.quadrant}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 flex gap-2">
                  <span>Urgensi: {selectedIssue.urgency}/10</span>
                  <span>•</span>
                  <span>Dampak: {selectedIssue.impact}/10</span>
                  <span>•</span>
                  <span>Status: {selectedIssue.state}</span>
                </div>
              </div>
            ) : (
              <p className="text-[10.5px] text-zinc-400 italic text-center">
                *Klik titik pada grafik untuk melihat rincian issue.
              </p>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
