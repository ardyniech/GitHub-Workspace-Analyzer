type Listener = (data: any) => void;

class EventDispatcher {
  private listeners: Map<string, Listener[]> = new Map();

  subscribe(event: string, listener: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)?.push(listener);
  }

  dispatch(event: string, data: any) {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }
}

export const dispatcher = new EventDispatcher();