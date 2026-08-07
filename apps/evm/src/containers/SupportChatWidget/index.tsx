import { cn } from '@venusprotocol/ui';
import { useEffect, useRef, useState } from 'react';

import { ChatMessageItem } from './ChatMessageItem';
import { useStore } from './store';
import { useChatAction } from './useChatAction';
import { useChatConversation } from './useChatConversation';

/**
 * Floating customer-support chat widget (bottom-right FAB + panel).
 * Talks to the venus-web-chat backend (submit-then-poll, queue-push from
 * the bot). Bot replies carry CTAs that can deep-link into the app: pop a
 * market's operations modal, a vault's modal, or the Venus Prime page.
 *
 * Styling intentionally keeps the standalone widget's branded gradient
 * look (venus-web-chat/web/widget.css) rather than app design tokens,
 * per design direction for this feature.
 */
const SupportChatWidget: React.FC = () => {
  const isOpen = useStore(state => state.isOpen);
  const setIsOpen = useStore(state => state.setIsOpen);
  const [inputValue, setInputValue] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  const { messages, isBusy, isSessionAlive, sendMessage, restartSession } = useChatConversation();
  const { dispatchAction } = useChatAction();

  // Keep the newest message in view, including while the typewriter grows it
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const intervalId = setInterval(() => {
      const log = logRef.current;
      if (log && log.scrollHeight - log.scrollTop - log.clientHeight > 8) {
        log.scrollTo({ top: log.scrollHeight });
      }
    }, 120);
    return () => clearInterval(intervalId);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
    setInputValue('');
  };

  const isComposerDisabled = isBusy || !isSessionAlive;

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[560px] max-h-[calc(100vh-120px)] w-95 max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[20px] border border-[rgba(143,160,196,0.18)] bg-[linear-gradient(180deg,#101a34,#0b1224)] shadow-[0_30px_80px_-20px_rgba(3,8,20,0.9)]">
          <div className="flex items-center gap-3 border-b border-[rgba(143,160,196,0.18)] bg-[linear-gradient(90deg,rgba(53,162,255,0.10),rgba(124,92,255,0.08))] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#35a2ff,#7c5cff)]">
              <span className="text-p3s text-[#061021]">♀</span>
            </div>

            <div className="flex-1">
              <p className="text-b1s text-white">Venus Assistant</p>

              <p className="flex items-center gap-1.5 text-b2r text-[#8fa0c4]">
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    isSessionAlive ? 'bg-[#3ddc97] shadow-[0_0_8px_#3ddc97]' : 'bg-[#6b7794]',
                  )}
                />
                {isSessionAlive ? 'Online · live market data' : 'Session closed'}
              </p>
            </div>

            <button
              type="button"
              aria-label="Minimize chat"
              className="rounded-lg px-2 py-1 text-p3r text-[#8fa0c4] hover:bg-[rgba(143,160,196,0.12)] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div ref={logRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map(message => (
              <ChatMessageItem
                key={message.id}
                message={message}
                onSendPrompt={sendMessage}
                onAction={dispatchAction}
                onRestart={restartSession}
              />
            ))}

            {isBusy && (
              <div className="flex gap-1.5 self-start rounded-2xl rounded-bl-md border border-[rgba(143,160,196,0.18)] bg-[#16213f] px-4 py-3.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8fa0c4]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8fa0c4] [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8fa0c4] [animation-delay:300ms]" />
              </div>
            )}
          </div>

          <form
            className="flex gap-2 border-t border-[rgba(143,160,196,0.18)] p-3"
            onSubmit={handleSubmit}
          >
            <input
              className="flex-1 rounded-xl border border-[rgba(143,160,196,0.18)] bg-[rgba(233,239,253,0.04)] px-3 py-2 text-b1r text-[#e9effd] outline-none placeholder:text-[#8fa0c4] focus:border-[#35a2ff] disabled:opacity-50"
              placeholder="Ask about Venus Protocol…"
              maxLength={2000}
              value={inputValue}
              disabled={isComposerDisabled}
              onChange={e => setInputValue(e.target.value)}
            />

            <button
              type="submit"
              disabled={isComposerDisabled}
              className="rounded-xl bg-[linear-gradient(135deg,#35a2ff,#7c5cff)] px-4 text-b1s text-[#061021] transition-transform hover:-translate-y-px disabled:cursor-default disabled:opacity-35"
            >
              Send
            </button>
          </form>

          <p className="pb-2 text-center text-b3r text-[#8fa0c4] opacity-65">
            Answers are reviewed before delivery · live Venus market data
          </p>
        </div>
      )}

      <button
        type="button"
        aria-label="Open Venus assistant"
        className={cn(
          'fixed bottom-6 right-4 z-50 rounded-full bg-[linear-gradient(135deg,#35a2ff,#7c5cff)] px-6 py-3 text-b1s text-white transition-transform duration-250',
          'shadow-[0_10px_34px_-6px_rgba(53,162,255,0.55)] hover:-translate-y-0.5 hover:scale-105',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        Ask Venus
      </button>
    </>
  );
};

export default SupportChatWidget;
