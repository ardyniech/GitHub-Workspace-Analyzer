import { HealthMetricPoint } from '../logic/types';

const HEALTH_STORAGE_KEY = 'agent_system_health_metrics_v1';

const INITIAL_HEALTH_SERIES: HealthMetricPoint[] = [
  { time: '00:00', latencyMs: 420, tokenEfficiencyPct: 91, improvementSuccessPct: 94 },
  { time: '04:00', latencyMs: 380, tokenEfficiencyPct: 93, improvementSuccessPct: 96 },
  { time: '08:00', latencyMs: 510, tokenEfficiencyPct: 88, improvementSuccessPct: 92 },
  { time: '12:00', latencyMs: 340, tokenEfficiencyPct: 95, improvementSuccessPct: 98 },
  { time: '16:00', latencyMs: 290, tokenEfficiencyPct: 96, improvementSuccessPct: 97 },
  { time: '20:00', latencyMs: 310, tokenEfficiencyPct: 97, improvementSuccessPct: 99 },
];

export function getHealthMetricSeries(): HealthMetricPoint[] {
  try {
    const raw = localStorage.getItem(HEALTH_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(INITIAL_HEALTH_SERIES));
      return INITIAL_HEALTH_SERIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HEALTH_SERIES;
  }
}

export function recordHealthMetric(point: HealthMetricPoint): void {
  try {
    const series = getHealthMetricSeries();
    series.push(point);
    const trimmed = series.slice(-20);
    localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('[Module:SystemHealth] Error saving health metric:', err);
  }
}
