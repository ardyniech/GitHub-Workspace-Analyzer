import { Issue } from '../../issue/storage/api';
import { IssuePriorityItem, PriorityMatrixSummary } from './priorityTypes';

export function calculateIssuePriorityMatrix(issues: Issue[]): PriorityMatrixSummary {
  const items: IssuePriorityItem[] = issues.map((issue) => {
    let urgency = 4;
    let impact = 4;

    const labelNames = (issue.labels || []).map((l) => l.name.toLowerCase());
    const titleLower = issue.title.toLowerCase();

    // Kalkulasi Urgensi
    if (labelNames.some((l) => l.includes('urgent') || l.includes('critical') || l.includes('p0') || l.includes('security'))) {
      urgency = 9;
    } else if (labelNames.some((l) => l.includes('bug') || l.includes('error') || l.includes('fix') || l.includes('p1'))) {
      urgency = 7;
    } else if (labelNames.some((l) => l.includes('enhancement') || l.includes('feature') || l.includes('p2'))) {
      urgency = 5;
    } else if (labelNames.some((l) => l.includes('documentation') || l.includes('question') || l.includes('low'))) {
      urgency = 2;
    }

    if (titleLower.includes('crash') || titleLower.includes('leak') || titleLower.includes('vulnerability')) {
      urgency = Math.min(10, urgency + 2);
    }

    // Kalkulasi Dampak
    if (labelNames.some((l) => l.includes('breaking') || l.includes('major') || l.includes('core') || l.includes('epic'))) {
      impact = 9;
    } else if (labelNames.some((l) => l.includes('feature') || l.includes('performance') || l.includes('ui/ux'))) {
      impact = 7;
    } else if (labelNames.some((l) => l.includes('refactor') || l.includes('cleanup') || l.includes('test'))) {
      impact = 4;
    } else if (labelNames.some((l) => l.includes('typo') || l.includes('minor') || l.includes('docs'))) {
      impact = 2;
    }

    // Penentuan Kuadran
    let quadrant: IssuePriorityItem['quadrant'] = 'Fill-ins';
    if (impact >= 5 && urgency >= 5) quadrant = 'Major Projects';
    else if (impact >= 5 && urgency < 5) quadrant = 'Quick Wins';
    else if (impact < 5 && urgency >= 5) quadrant = 'Thankless Tasks';
    else quadrant = 'Fill-ins';

    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      state: issue.state,
      urgency,
      impact,
      quadrant,
      labels: (issue.labels || []).map((l) => l.name),
      author: issue.user?.login || 'anonymous',
    };
  });

  return {
    quickWins: items.filter((i) => i.quadrant === 'Quick Wins').length,
    majorProjects: items.filter((i) => i.quadrant === 'Major Projects').length,
    fillIns: items.filter((i) => i.quadrant === 'Fill-ins').length,
    thanklessTasks: items.filter((i) => i.quadrant === 'Thankless Tasks').length,
    items,
  };
}
