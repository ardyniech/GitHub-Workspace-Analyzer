import { RepoRecommendation } from './types';
import { dispatcher } from '../../../core/dispatcher';
import { markRecommendationCompleted } from '../storage/recommendationStorage';

export interface BatchFixProgress {
  total: number;
  current: number;
  currentTitle: string;
  isCompleted: boolean;
}

export async function executeBatchRecommendations(
  repoFullName: string,
  items: RepoRecommendation[],
  onProgress?: (progress: BatchFixProgress) => void
): Promise<void> {
  const pending = items.filter((i) => i.status === 'idle');
  if (pending.length === 0) {
    dispatcher.emit('notify:push', {
      type: 'info',
      title: 'Batch Fix Selesai',
      message: 'Seluruh rekomendasi kritis telah diterapkan sebelumnya.',
    });
    return;
  }

  dispatcher.emit('notify:push', {
    type: 'info',
    title: 'Memulai Batch Autonomous Fix',
    message: `Menjadwalkan ${pending.length} rekomendasi ke antrean eksekusi agen...`,
  });

  for (let i = 0; i < pending.length; i++) {
    const rec = pending[i];
    onProgress?.({
      total: pending.length,
      current: i + 1,
      currentTitle: rec.title,
      isCompleted: false,
    });

    dispatcher.emit('agentTask:enqueue', {
      title: `[Batch ${i + 1}/${pending.length}] ${rec.title}`,
      type: 'improvement',
      target: rec.suggestedPrompt,
      source: 'batchFix',
    });

    markRecommendationCompleted(repoFullName, rec.id);

    // Simulate batch step pacing
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  // Trigger main AI execution for the batch
  const combinedPrompts = pending.map((p) => `- ${p.suggestedPrompt}`).join('\n');
  dispatcher.emit('ai:executeCommand', {
    prompt: `Eksekusi perbaikan komprehensif berikut secara berurutan dalam satu commit semantik:\n${combinedPrompts}`,
    context: `Batch Autonomous Fix (${pending.length} tasks)`,
    autoPush: true,
  });

  onProgress?.({
    total: pending.length,
    current: pending.length,
    currentTitle: 'Selesai',
    isCompleted: true,
  });

  dispatcher.emit('notify:push', {
    type: 'success',
    title: 'Batch Task Enqueued',
    message: `${pending.length} perbaikan telah dimasukkan ke antrean agen & dikirim ke Copilot!`,
  });
}
