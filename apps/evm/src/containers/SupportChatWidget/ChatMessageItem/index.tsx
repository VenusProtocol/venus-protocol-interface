import { cn } from '@venusprotocol/ui';
import { useEffect, useState } from 'react';

import type { ChatCta, ChatMessage } from '../types';

const TYPEWRITER_CHARS_PER_TICK = 3;
const TYPEWRITER_TICK_MS = 14;

const CTA_CLASSES =
  'rounded-full border border-[rgba(53,162,255,0.45)] bg-[rgba(53,162,255,0.08)] px-3.5 py-1.5 text-b2s text-[#9ccdff] transition-all hover:-translate-y-px hover:bg-[rgba(53,162,255,0.2)]';

export interface ChatMessageItemProps {
  message: ChatMessage;
  onSendPrompt: (prompt: string) => void;
  onAction: (action: string) => void;
  onRestart: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSendPrompt,
  onAction,
  onRestart,
}) => {
  const [visibleCharCount, setVisibleCharCount] = useState(
    message.animate ? 0 : message.text.length,
  );
  const isFullyRevealed = visibleCharCount >= message.text.length;

  // Typewriter reveal for bot answers (the bot only releases reviewed,
  // completed answers, so there is nothing to stream — we reveal instead)
  useEffect(() => {
    if (!message.animate || isFullyRevealed) {
      return;
    }

    const intervalId = setInterval(
      () =>
        setVisibleCharCount(prevCount =>
          Math.min(message.text.length, prevCount + TYPEWRITER_CHARS_PER_TICK),
        ),
      TYPEWRITER_TICK_MS,
    );

    return () => clearInterval(intervalId);
  }, [message.animate, message.text.length, isFullyRevealed]);

  const handleCtaClick = (cta: ChatCta) => {
    if (cta.action) {
      onAction(cta.action);
      return;
    }
    if (cta.prompt) {
      onSendPrompt(cta.prompt);
      return;
    }
    if (cta.url) {
      window.open(cta.url, '_blank', 'noreferrer');
    }
  };

  if (message.role === 'notice') {
    return (
      <div className="flex max-w-[92%] flex-col items-center gap-2 self-center rounded-xl border border-dashed border-[rgba(143,160,196,0.18)] bg-[rgba(143,160,196,0.08)] px-4 py-2.5 text-center">
        <p className="text-b2r text-[#8fa0c4]">{message.text}</p>

        {message.showRestart && (
          <button
            type="button"
            className="rounded-full bg-[linear-gradient(120deg,#35a2ff,#7c5cff)] px-3.5 py-1.5 text-b2s text-[#061021] transition-transform hover:-translate-y-px"
            onClick={onRestart}
          >
            Start a new conversation
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex max-w-[88%] flex-col gap-2',
        message.role === 'user' ? 'items-end self-end' : 'items-start self-start',
      )}
    >
      <p
        className={cn(
          'whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-b1r',
          message.role === 'user'
            ? 'rounded-br-md bg-[linear-gradient(120deg,#2f8fe6,#6d4ff0)] text-[#f4f8ff]'
            : 'rounded-bl-md border border-[rgba(143,160,196,0.18)] bg-[#16213f] text-[#e9effd]',
        )}
      >
        {message.text.slice(0, visibleCharCount)}
      </p>

      {isFullyRevealed && !!message.ctas?.length && (
        <div className="flex flex-wrap gap-2">
          {message.ctas.map(cta => (
            <button
              key={cta.label}
              type="button"
              className={CTA_CLASSES}
              onClick={() => handleCtaClick(cta)}
            >
              {cta.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
