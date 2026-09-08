type Listener = (payload: any) => void;

class Dispatcher {
  private listeners: Map<string, Set<Listener>> = new Map();

  on(event: string, callback: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: Listener): void {
    const list = this.listeners.get(event);
    if (list) {
      list.delete(callback);
      if (list.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event: string, payload?: any): void {
    const list = this.listeners.get(event);
    if (list) {
      list.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[Module:Core] Error in listener for ${event}:`, err);
        }
      });
    }
  }
}

export const dispatcher = new Dispatcher();
