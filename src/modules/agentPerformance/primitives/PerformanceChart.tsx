import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AgentPerformanceDataPoint } from '../logic/types';

interface PerformanceChartProps {
  data: AgentPerformanceDataPoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="w-full h-[260px] bg-white rounded-xl border border-zinc-200 p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-zinc-900">Tren Tingkat Keberhasilan & Skor Peer Review</span>
        <span className="text-[10px] text-zinc-400 font-mono">Skala (%)</span>
      </div>

      <div className="w-full h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} stroke="#e4e4e7" />
            <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#71717a' }} stroke="#e4e4e7" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="autoImprovementSuccessRate"
              name="Auto-Improvement Success (%)"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#8b5cf6' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="peerReviewScore"
              name="Peer Review Score (0-100)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
