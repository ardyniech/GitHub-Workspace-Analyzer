import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { Input } from '../../../shared/atoms/Input';
import { useSpeechRecognition } from '../logic/useSpeechRecognition';
import { Sparkles, Send, Mic, MicOff } from 'lucide-react';

interface AiChatInputProps {
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  repoFullName: string | undefined;
  onSend: (text: string) => void;
}

export function AiChatInput({
  input,
  setInput,
  loading,
  repoFullName,
  onSend,
}: AiChatInputProps) {
  const { isListening, isSupported, toggleListening } = useSpeechRecognition((transcript) => {
    setInput(transcript);
  });

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex gap-2 items-center">
        <Input
          id="ai-prompt"
          placeholder={
            isListening
              ? 'Mendengarkan suara Anda...'
              : repoFullName
              ? 'Tanyakan kode, instruksi, atau gunakan suara...'
              : 'Pilih repositori...'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || !repoFullName}
          icon={<Sparkles className="w-4 h-4 text-zinc-400" />}
          onKeyDown={(e) => e.key === 'Enter' && onSend(input)}
          className={isListening ? 'ring-2 ring-purple-500 bg-purple-50/50' : ''}
        />

        {isSupported && (
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={toggleListening}
            disabled={loading || !repoFullName}
            icon={
              isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4 text-purple-600" />
              )
            }
            className={`h-10 px-3 shrink-0 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-purple-600 text-white hover:bg-purple-700 animate-pulse shadow-md'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
            title={isListening ? 'Hentikan dikte suara' : 'Mulai bicara (Speech-to-Text)'}
          >
            <span className="hidden sm:inline text-xs font-semibold">
              {isListening ? 'Mendengarkan' : 'Suara'}
            </span>
          </Button>
        )}

        <Button
          size="sm"
          onClick={() => onSend(input)}
          disabled={loading || !input.trim() || !repoFullName}
          icon={<Send className="w-3.5 h-3.5" />}
          className="h-10 shrink-0"
        >
          {loading ? '...' : 'Kirim'}
        </Button>
      </div>

      {isListening && (
        <div className="flex items-center gap-1.5 px-2 text-[11px] text-purple-600 font-medium animate-pulse">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
          <span>Bicaralah sekarang. Suara Anda akan otomatis ditulis ke dalam kotak input.</span>
        </div>
      )}
    </div>
  );
}
