import React, { useState, useRef, useEffect } from 'react';
import { useAi } from '../logic/useAi';
import { usePrDraftGenerator } from '../logic/usePrDraftGenerator';
import { generateReportMarkdown, downloadMarkdownFile } from '../logic/exportReport';
import { useLiveVoice } from '../logic/useLiveVoice';
import { useAuth } from '../../auth';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AiChatInput } from './AiChatInput';
import { AiChatSuggestions } from './AiChatSuggestions';
import { AiChatHeader } from './AiChatHeader';
import { PrDraftCard } from './PrDraftCard';
import { LiveVoiceModal } from './LiveVoiceModal';

interface AiChatProps {
  repoFullName: string | undefined;
  repoDescription: string | null;
  readmeText: string;
}

export function AiChat({ repoFullName, repoDescription, readmeText }: AiChatProps) {
  const { token } = useAuth();
  const { messages, loading, activeModel, sendMessage, clearChat } = useAi(repoFullName, repoDescription, token);
  const { draft, generateDraft, clearDraft } = usePrDraftGenerator(repoFullName, token);
  const { status: voiceStatus, errorMessage: voiceError, volumeLevel, startSession: startVoice, stopSession: stopVoice } = useLiveVoice();
  const [showVoice, setShowVoice] = useState(false);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, draft]);

  const handleSend = (text: string) => {
    if (!text.trim() || loading) return;
    sendMessage(text, readmeText);
    if (text === input) setInput('');
  };

  const handleExport = () => {
    if (!repoFullName || messages.length <= 1) return;
    const md = generateReportMarkdown({ repoFullName, activeModel, messages });
    const slug = repoFullName.replace('/', '-');
    downloadMarkdownFile(`laporan-analisis-${slug}-${new Date().toISOString().slice(0, 10)}.md`, md);
  };

  const hasAnalysis = messages.some((m) => m.sender === 'assistant' && m.id !== 'welcome');
  const containerClasses = isExpanded
    ? 'fixed inset-2 md:inset-6 z-50 bg-white rounded-2xl shadow-2xl border border-zinc-300 flex flex-col p-4 md:p-6 overflow-hidden'
    : 'bg-white rounded-xl border border-zinc-200 shadow-xs flex flex-col p-4 h-[580px] md:h-[640px]';

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 bg-zinc-900/50 z-40 backdrop-blur-xs" onClick={() => setIsExpanded(false)} />
      )}
      <div className={containerClasses}>
        <AiChatHeader
          repoFullName={repoFullName}
          activeModel={activeModel}
          loading={loading}
          isExpanded={isExpanded}
          canExport={hasAnalysis}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onTriggerSecurityScan={() => handleSend('Lakukan Security Scan & Dependency Audit mendalam berdasarkan struktur berkas dan manifest riil repositori ini.')}
          onGeneratePrDraft={async () => {
            await generateDraft();
            handleSend('Buatkan checklist serta ringkasan deskripsi Pull Request yang profesional berdasarkan commit dan audit keamanan.');
          }}
          onExportReport={handleExport}
          onOpenVoice={() => { setShowVoice(true); startVoice(repoFullName); }}
          onClearChat={clearChat}
        />
        <div className="flex-1 overflow-y-auto my-3 pr-2 flex flex-col gap-3 text-xs md:text-sm">
          {draft && repoFullName && <PrDraftCard draft={draft} repoFullName={repoFullName} onClose={clearDraft} />}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[85%] p-3 rounded-xl leading-relaxed shadow-2xs ${
                msg.sender === 'user' ? 'self-end bg-zinc-900 text-white whitespace-pre-wrap' : 'self-start bg-zinc-100/90 text-zinc-800 border border-zinc-200/70'
              }`}
            >
              {msg.sender === 'assistant' ? <MarkdownRenderer text={msg.text} repoFullName={repoFullName} /> : msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {messages.length === 1 && repoFullName && (
          <AiChatSuggestions onSelect={handleSend} onGeneratePrDraft={generateDraft} disabled={loading} />
        )}
        <AiChatInput input={input} setInput={setInput} loading={loading} repoFullName={repoFullName} onSend={handleSend} />
      </div>
      {showVoice && (
        <LiveVoiceModal
          status={voiceStatus}
          errorMessage={voiceError}
          volumeLevel={volumeLevel}
          repoFullName={repoFullName}
          onStart={() => startVoice(repoFullName)}
          onStop={stopVoice}
          onClose={() => { setShowVoice(false); stopVoice(); }}
        />
      )}
    </>
  );
}
