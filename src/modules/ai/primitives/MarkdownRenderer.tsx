import React from 'react';
import { CodeBlock } from './CodeBlock';
import { CopilotProposal } from './CopilotProposal';

interface MarkdownRendererProps {
  text: string;
  repoFullName?: string;
}

export function MarkdownRenderer({ text, repoFullName }: MarkdownRendererProps) {
  if (!text) return null;

  // Split content by triple backticks to extract code blocks
  const segments = text.split('```');

  return (
    <div className="flex flex-col gap-1 select-text">
      {segments.map((segment, index) => {
        const isCodeBlock = index % 2 !== 0;

        if (isCodeBlock) {
          // The first line inside code block usually contains the language (e.g. javascript)
          const firstLineIndex = segment.indexOf('\n');
          const language = firstLineIndex !== -1 ? segment.substring(0, firstLineIndex).trim() : '';
          const code = firstLineIndex !== -1 ? segment.substring(firstLineIndex + 1) : segment;

          if (language === 'copilot' && repoFullName) {
            return (
              <div key={index}>
                <CopilotProposal jsonString={code} repoFullName={repoFullName} />
              </div>
            );
          }

          return (
            <div key={index}>
              <CodeBlock language={language} code={code} />
            </div>
          );
        }

        // For regular markdown text, parse lines (headers, list items, paragraphs)
        const lines = segment.split('\n');
        return (
          <div key={index} className="flex flex-col gap-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // Parse Headers
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lineIdx} className="font-bold text-zinc-900 text-xs mt-1">
                    {parseInlineStyles(trimmed.substring(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
                const cleanText = trimmed.startsWith('## ') ? trimmed.substring(3) : trimmed.substring(2);
                return (
                  <h3 key={lineIdx} className="font-bold text-zinc-950 text-xs mt-1.5 border-b border-zinc-200/50 pb-0.5">
                    {parseInlineStyles(cleanText)}
                  </h3>
                );
              }

              // Parse Lists
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lineIdx} className="flex gap-1.5 ml-1.5 text-zinc-700 leading-relaxed text-xs">
                    <span className="text-zinc-400 select-none">•</span>
                    <span className="flex-1">{parseInlineStyles(trimmed.substring(2))}</span>
                  </div>
                );
              }

              // Default Paragraph
              return (
                <p key={lineIdx} className="text-zinc-700 leading-relaxed text-xs">
                  {parseInlineStyles(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Parses bold (**text**) and inline code (`code`) into React elements
 */
function parseInlineStyles(text: string): React.ReactNode[] {
  // Regex to split by **bold** or `inline code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-zinc-900">
          {part.substring(2, part.length - 2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1 py-0.5 rounded bg-zinc-250 text-zinc-800 font-mono text-[10px] border border-zinc-300">
          {part.substring(1, part.length - 1)}
        </code>
      );
    }
    return part;
  });
}
