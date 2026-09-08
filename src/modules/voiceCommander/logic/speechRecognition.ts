export class VoiceSpeechService {
  private recognition: any = null;
  private audioCtx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;

  constructor(
    private onTranscript: (text: string, isFinal: boolean) => void,
    private onVolume: (level: number) => void,
    private onError: (err: string) => void,
    private onEnd: () => void
  ) {}

  async start(): Promise<boolean> {
    try {
      this.stop();
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRec) {
        this.onError('Browser ini belum mendukung Web Speech API bawaan.');
        return false;
      }

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.setupVolumeMeter(this.stream);

      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'id-ID';

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const combined = (final || interim).trim();
        if (combined) {
          this.onTranscript(combined, !!final);
        }
      };

      this.recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech') {
          this.onError(`Error mikrofon: ${e.error || 'Gagal mendengar suara'}`);
        }
      };

      this.recognition.onend = () => {
        this.onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.error(`[Module:VoiceCommander] Error in start: ${err?.message || err}`);
      this.onError(err?.message || 'Izin mikrofon ditolak atau tidak tersedia.');
      this.stop();
      return false;
    }
  }

  private setupVolumeMeter(stream: MediaStream) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const avg = sum / bufferLength;
        this.onVolume(Math.min(1, avg / 100));
        this.animFrameId = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (err: any) {
      console.error(`[Module:VoiceCommander] Error setupVolumeMeter: ${err?.message || err}`);
    }
  }

  stop() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
      this.recognition = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch {}
      this.audioCtx = null;
    }
    this.onVolume(0);
  }
}
