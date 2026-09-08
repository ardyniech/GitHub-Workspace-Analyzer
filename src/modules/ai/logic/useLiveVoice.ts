import { useState, useRef, useCallback, useEffect } from 'react';
import { float32To16BitPCM, arrayBufferToBase64 } from './audioPcmUtils';
import { PcmAudioPlayer } from './audioPlayer';

export type VoiceStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';

export function useLiveVoice() {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const playerRef = useRef<PcmAudioPlayer>(new PcmAudioPlayer());

  const stopSession = useCallback(() => {
    playerRef.current.stopAll();
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (inputAudioCtxRef.current) { inputAudioCtxRef.current.close(); inputAudioCtxRef.current = null; }
    setStatus('idle');
    setVolumeLevel(0);
  }, []);

  const startSession = useCallback(async (repoContext?: string) => {
    try {
      stopSession();
      setStatus('connecting');
      setErrorMessage(null);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/api/live-voice`);
      wsRef.current = ws;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        const inputFloats = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < inputFloats.length; i++) sum += inputFloats[i] * inputFloats[i];
        setVolumeLevel(Math.min(1, Math.sqrt(sum / inputFloats.length) * 4));

        const pcmBuf = float32To16BitPCM(inputFloats);
        ws.send(JSON.stringify({ audio: arrayBufferToBase64(pcmBuf) }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.error) { setErrorMessage(msg.error); setStatus('error'); }
        if (msg.ready) {
          setStatus('listening');
          if (repoContext) ws.send(JSON.stringify({ text: `Konteks repositori: ${repoContext}` }));
        }
        if (msg.audio) {
          setStatus('speaking');
          playerRef.current.playChunk(msg.audio, () => setStatus('listening'));
        }
        if (msg.interrupted) { playerRef.current.stopAll(); setStatus('listening'); }
      };

      ws.onerror = () => { setErrorMessage('Gagal terhubung ke layanan suara AI.'); setStatus('error'); };
      ws.onclose = () => { setStatus('idle'); };
    } catch (err: any) {
      console.error(`[Module:LiveVoice] Error in startSession: ${err?.message || err}`);
      setErrorMessage(err?.message || 'Izin mikrofon tidak tersedia.');
      setStatus('error');
    }
  }, [stopSession]);

  useEffect(() => () => { stopSession(); playerRef.current.close(); }, [stopSession]);

  return { status, errorMessage, volumeLevel, startSession, stopSession };
}
