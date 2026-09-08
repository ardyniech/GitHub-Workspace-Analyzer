import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export function setupLiveVoiceServer(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: '/api/live-voice' });

  wss.on('connection', async (clientWs: WebSocket, req) => {
    console.log('[Module:LiveVoice] Client connected for voice session');
    let session: any = null;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY tidak dikonfigurasi di server.' }));
        clientWs.close();
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      session = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction:
            'You are a friendly, expert GitHub AI Voice Copilot. Help the user understand code, debug issues, ' +
            'and improve their repository architecture. Speak clearly, concisely, and naturally in Indonesian or English according to user language.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            try {
              const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audio && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ audio }));
              }
              if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ interrupted: true }));
              }
            } catch (err: any) {
              console.error(`[Module:LiveVoice] Error in onmessage: ${err?.message || err}`);
            }
          },
          onclose: () => {
            console.log('[Module:LiveVoice] Gemini Live session closed');
          },
          onerror: (err: any) => {
            console.error(`[Module:LiveVoice] Gemini Live session error: ${err?.message || err}`);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: 'Koneksi suara Gemini terputus.' }));
            }
          },
        },
      });

      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ ready: true, model: 'gemini-3.1-flash-live-preview' }));
      }
    } catch (err: any) {
      console.error(`[Module:LiveVoice] Error initiating session: ${err?.message || err}`);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: 'Gagal menghubungkan sesi suara Live API.' }));
      }
      clientWs.close();
      return;
    }

    clientWs.on('message', (data: any) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.audio && session) {
          session.sendRealtimeInput({
            audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
        if (payload.text && session) {
          session.sendRealtimeInput({ text: payload.text });
        }
      } catch (err: any) {
        console.error(`[Module:LiveVoice] Error parsing client message: ${err?.message || err}`);
      }
    });

    clientWs.on('close', () => {
      console.log('[Module:LiveVoice] Client disconnected, closing session');
      try {
        if (session) session.close();
      } catch (err: any) {
        console.error(`[Module:LiveVoice] Error closing session: ${err?.message || err}`);
      }
    });
  });
}
