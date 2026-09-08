import React from 'react';
import { ArchitectureNode, ArchitectureRelation } from '../logic/types';
import { Network, Link, Box } from 'lucide-react';

interface ArchitectureDiagramViewProps {
  nodes: ArchitectureNode[];
  relations: ArchitectureRelation[];
}

export function ArchitectureDiagramView({ nodes, relations }: ArchitectureDiagramViewProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Node Grid Map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {nodes.map((node) => {
          const typeColors = {
            core: 'border-indigo-200 bg-indigo-50/50 text-indigo-950',
            module: 'border-emerald-200 bg-emerald-50/40 text-emerald-950',
            shared: 'border-amber-200 bg-amber-50/40 text-amber-950',
            ui: 'border-rose-200 bg-rose-50/40 text-rose-950',
          };

          return (
            <div
              key={node.id}
              className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition-all hover:shadow-xs ${typeColors[node.type]}`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Box className="w-3.5 h-3.5 text-zinc-500 shrink-0 animate-pulse" />
                  <span className="font-bold text-xs truncate">{node.label}</span>
                </div>
                <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-white/80 border border-current">
                  {node.type}
                </span>
              </div>

              <p className="text-[10px] text-zinc-600 leading-snug">{node.description}</p>

              {node.methods && node.methods.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-dashed border-zinc-200">
                  {node.methods.map((method, mi) => (
                    <span
                      key={mi}
                      className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-200/80 text-zinc-500"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Relation Connections Panel */}
      <div className="mt-2 bg-zinc-50 rounded-xl border border-zinc-200/80 p-3">
        <h4 className="text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Network className="w-3.5 h-3.5 text-zinc-500" />
          Hubungan Dependensi Seluler (ER Connections)
        </h4>
        <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 pr-1">
          {relations.map((rel, ri) => (
            <div
              key={ri}
              className="flex items-center gap-2 p-1.5 bg-white border border-zinc-200 rounded-lg text-[10px] text-zinc-600 font-medium"
            >
              <span className="font-bold text-indigo-700 truncate max-w-[120px]">{rel.source}</span>
              <div className="flex items-center gap-1 text-zinc-400 shrink-0 font-mono text-[9px]">
                <Link className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-extrabold text-zinc-500 capitalize">{rel.type}</span>
              </div>
              <span className="font-bold text-zinc-800 truncate max-w-[120px]">{rel.target}</span>
              <span className="text-[9.5px] text-zinc-400 truncate ml-auto italic border-l pl-2 border-zinc-100 hidden md:inline">
                {rel.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
