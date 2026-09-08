export { SystemHealthModal } from './primitives/SystemHealthModal';
export { computeSystemHealthSummary, getSystemHealthTimeSeries } from './logic/systemHealthEngine';
export { getHealthMetricSeries, recordHealthMetric } from './storage/systemHealthStorage';
export type { HealthMetricPoint, SystemHealthSummary } from './logic/types';
