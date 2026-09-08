import { describe, it, expect } from 'vitest';
import { dispatcher } from '@/src/core/dispatcher';

describe('TaskQueueEngine', () => {
  it('should dispatch events correctly', () => {
    let received = false;
    dispatcher.subscribe('task-added', () => received = true);
    dispatcher.dispatch('task-added', { id: 1 });
    expect(received).toBe(true);
  });
});