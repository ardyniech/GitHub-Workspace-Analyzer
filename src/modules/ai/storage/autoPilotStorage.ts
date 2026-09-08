const AUTOPILOT_KEY = 'github_analyzer_autopilot_enabled';

export function isAutoPilotEnabled(): boolean {
  try {
    const val = localStorage.getItem(AUTOPILOT_KEY);
    return val === null ? true : val === 'true';
  } catch (err: any) {
    console.error('[Module:AI] Error in isAutoPilotEnabled:', err?.message || err);
    return true;
  }
}

export function setAutoPilotEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(AUTOPILOT_KEY, String(enabled));
  } catch (err: any) {
    console.error('[Module:AI] Error in setAutoPilotEnabled:', err?.message || err);
  }
}
