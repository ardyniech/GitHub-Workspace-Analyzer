export const MODULES_REGISTRY = {
  auth: { name: 'Auth Module', version: '1.0.0' },
  repo: { name: 'Repo Module', version: '1.0.0' },
  issue: { name: 'Issue Module', version: '1.0.0' },
  pr: { name: 'PR Module', version: '1.0.0' },
  ai: { name: 'AI Module', version: '1.0.0' },
  security: { name: 'Security Module', version: '1.0.0' },
  sentiment: { name: 'Sentiment Module', version: '1.0.0' },
  tester: { name: 'Pre-Commit Tester Module', version: '1.0.0' },
  analytics: { name: 'Analytics D3 Module', version: '1.0.0' },
};

export function loadAllModules() {
  console.log('[Core:Loader] Loading modules...');
  Object.entries(MODULES_REGISTRY).forEach(([key, info]) => {
    console.log(`[Core:Loader] Module registered: ${info.name} v${info.version}`);
  });
  return true;
}
