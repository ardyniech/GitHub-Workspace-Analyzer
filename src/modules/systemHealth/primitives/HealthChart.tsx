import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HealthMetricPoint } from '../logic/types';

interface HealthChartProps {
  data: HealthMetricPoint[];
  metricKey: 'latencyMs' | 'tokenEfficiencyPct' | 'improvementSuccessPct';
  color: string;
  unit: string;
}

export function HealthChart({ data, metricKey, color, unit }: HealthChartProps) {
  return (
    <div className="w-full h-44 bg-zinc-50/50 p-2 rounded-xl border border-zinc-200">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#71717a' }} />
          <YAxis tick={{ fontSize: 10, fill: '#71717a' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
            formatter={(value: any) => [`${value}${unit}`, metricKey]}
          />
          <Area type="monotone" dataKey={metricKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${metricKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
