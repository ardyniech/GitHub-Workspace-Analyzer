import { RepoRecommendation, QuickActionItem } from './types';
import { dispatcher } from '../../../core/dispatcher';

export function dispatchRecommendationExecution(rec: RepoRecommendation): void {
  dispatcher.emit('agentTask:enqueue', {
    title: rec.title,
    type: 'improvement',
    target: rec.suggestedPrompt,
    source: 'repoRecommendation',
  });

  dispatcher.emit('ai:executeCommand', {
    prompt: rec.suggestedPrompt,
    context: `Rekomendasi Perbaikan: ${rec.title} (${rec.category})`,
    autoPush: true,
  });

  dispatcher.emit('notify:push', {
    type: 'info',
    title: 'Menjalankan Rekomendasi AI',
    message: `Agen sedang mengeksekusi: "${rec.title}" secara langsung...`,
  });
}

export function dispatchQuickActionExecution(action: QuickActionItem): void {
  dispatcher.emit('agentTask:enqueue', {
    title: action.label,
    type: 'quick_action',
    target: action.prompt,
    source: 'quickAction',
  });

  dispatcher.emit('ai:executeCommand', {
    prompt: action.prompt,
    context: `Quick Action: ${action.label}`,
    autoPush: true,
  });

  dispatcher.emit('notify:push', {
    type: 'info',
    title: `⚡ Eksekusi Cepat: ${action.label}`,
    message: 'Perintah langsung dikirimkan ke AI Agent untuk dieksekusi tanpa basa-basi.',
  });
}
