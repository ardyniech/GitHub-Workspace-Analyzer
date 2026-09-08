import { base64ToArrayBuffer, pcm16ToFloat32 } from './audioPcmUtils';

export class PcmAudioPlayer {
  private ctx: AudioContext | null = null;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  playChunk(base64Data: string, onEndedAll?: () => void) {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const arrayBuf = base64ToArrayBuffer(base64Data);
      const int16 = new Int16Array(arrayBuf);
      const float32 = pcm16ToFloat32(int16);

      const buffer = this.ctx.createBuffer(1, float32.length, 24000);
      buffer.copyToChannel(float32, 0);

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);

      const now = this.ctx.currentTime;
      if (this.nextStartTime < now) this.nextStartTime = now;

      source.start(this.nextStartTime);
      this.nextStartTime += buffer.duration;
      this.activeSources.push(source);

      source.onended = () => {
        this.activeSources = this.activeSources.filter((s) => s !== source);
        if (this.activeSources.length === 0 && onEndedAll) onEndedAll();
      };
    } catch (err: any) {
      console.error(`[Module:AI] Error in PcmAudioPlayer: ${err?.message || err}`);
    }
  }

  stopAll() {
    this.activeSources.forEach((s) => {
      try { s.stop(); } catch {}
    });
    this.activeSources = [];
    this.nextStartTime = 0;
  }

  close() {
    this.stopAll();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
