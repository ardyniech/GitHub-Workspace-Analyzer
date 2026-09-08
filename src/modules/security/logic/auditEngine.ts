export interface SecurityAuditResult {
  passed: boolean;
  issues: string[];
}

export const runSecurityAudit = (repoContext: any): SecurityAuditResult => {
  const issues: string[] = [];
  if (!repoContext.isPrivate) {
    issues.push('Public repository detected: ensure no sensitive keys are hardcoded.');
  }
  return {
    passed: issues.length === 0,
    issues
  };
};
