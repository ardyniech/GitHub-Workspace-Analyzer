import { StyleDeltaRecord } from '../logic/types';

const AUDIT_DELTA_KEY = 'agent_self_audit_delta_history_v1';

const INITIAL_DEMO_DELTAS: StyleDeltaRecord[] = [
  {
    id: 'delta-1',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    version: '1.2.0',
    action: 'rule_added',
    ruleTitle: 'Micro-Padding Ergonomics (8-12px) & Hit-Slop >=44px',
    category: 'ui_ux',
    impactScoreBefore: 80,
    impactScoreAfter: 92,
    changeDescription: 'Penambahan standar area sentuh dan optimasi tata letak visual.',
  },
  {
    id: 'delta-2',
    timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    version: '1.1.0',
    action: 'developer_override',
    ruleTitle: 'Strict File Size Limit (<125 Lines)',
    category: 'architecture',
    impactScoreBefore: 90,
    impactScoreAfter: 98,
    changeDescription: 'Override pengembang untuk penegakan batas file kaku <125 baris.',
  },
  {
    id: 'delta-3',
    timestamp: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    version: '1.0.5',
    action: 'rule_modified',
    ruleTitle: 'Zero Implicit Any & Strict Props Interface',
    category: 'type_safety',
    impactScoreBefore: 88,
    impactScoreAfter: 95,
    changeDescription: 'Peningkatan bobot kepatuhan tipe eksplisit pada komponen React.',
  },
];

export function getAuditDeltas(): StyleDeltaRecord[] {
  try {
    const raw = localStorage.getItem(AUDIT_DELTA_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_DELTA_KEY, JSON.stringify(INITIAL_DEMO_DELTAS));
      return INITIAL_DEMO_DELTAS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_DELTAS;
  }
}

export function saveAuditDelta(delta: StyleDeltaRecord): void {
  try {
    const list = getAuditDeltas();
    list.unshift(delta);
    localStorage.setItem(AUDIT_DELTA_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (err) {
    console.error('[Module:selfAudit] Error saving audit delta:', err);
  }
}
