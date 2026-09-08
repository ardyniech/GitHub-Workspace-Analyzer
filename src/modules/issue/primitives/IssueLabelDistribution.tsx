import React from 'react';
import { Tag } from 'lucide-react';
import { Issue } from '../storage/api';

interface IssueLabelDistributionProps {
  openIssues: Issue[];
}

export function IssueLabelDistribution({ openIssues }: IssueLabelDistributionProps) {
  const labelCounts: { [key: string]: { count: number; color: string } } = {};

  openIssues.forEach((issue) => {
    if (issue.labels && Array.isArray(issue.labels)) {
      issue.labels.forEach((label) => {
        if (!labelCounts[label.name]) {
          labelCounts[label.name] = { count: 0, color: label.color };
        }
        labelCounts[label.name].count += 1;
      });
    }
  });

  const sortedLabels = Object.entries(labelCounts)
    .map(([name, data]) => ({ name, count: data.count, color: data.color }))
    .sort((a, b) => b.count - a.count);

  const totalLabelsCount = sortedLabels.reduce((acc, curr) => acc + curr.count, 0);

  if (sortedLabels.length === 0) return null;

  return (
    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-zinc-700 text-[11px] flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-zinc-500" />
          Distribusi Label (Issue Aktif)
        </span>
        <span className="text-[10px] text-zinc-400 font-medium">
          {openIssues.length} Issue Terbuka
        </span>
      </div>

      <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden flex">
        {sortedLabels.map((item) => {
          const percentage = (item.count / totalLabelsCount) * 100;
          return (
            <div
              key={item.name}
              style={{
                width: `${percentage}%`,
                backgroundColor: `#${item.color}`,
              }}
              title={`${item.name}: ${item.count} (${percentage.toFixed(1)}%)`}
              className="h-full hover:opacity-85 transition-opacity cursor-help"
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] text-zinc-500 max-h-[80px] overflow-y-auto pr-1 mt-1">
        {sortedLabels.slice(0, 6).map((item) => {
          const percentage = (item.count / totalLabelsCount) * 100;
          return (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: `#${item.color}` }}
                />
                <span className="font-medium text-zinc-600 truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-zinc-700 shrink-0">
                {item.count} ({Math.round(percentage)}%)
              </span>
            </div>
          );
        })}
        {sortedLabels.length > 6 && (
          <div className="col-span-2 text-center text-[9px] text-zinc-400 font-medium mt-1">
            + {sortedLabels.length - 6} label lainnya
          </div>
        )}
      </div>
    </div>
  );
}
