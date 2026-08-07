import { Button, cn } from '@venusprotocol/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from 'components';
import { useNavigate } from 'hooks/useNavigate';

import { useResolveIntent } from './useResolveIntent';
import { type ChatIntent, runWorkflow } from './workflows';

interface Message {
  id: number;
  author: 'user' | 'bot';
  text: string;
  intent?: ChatIntent;
  ctaLabel?: string;
}

const GREETING: Message = {
  id: 0,
  author: 'bot',
  text: 'Demo assistant — no model behind it, just a handful of hard-coded workflows. Try "supply USDT".',
};

/**
 * Proof-of-concept chat surface that drives the dApp through its own router.
 *
 * The whole point is what it does *not* do: it renders no market form of its own, holds no token
 * addresses, and builds no transactions. It produces an intent, asks the app to resolve it to a
 * route, and navigates. Every product that already has a deep link is reachable this way with no
 * further work here — which is why the market form, its gated-asset acknowledgement and its
 * validation all keep working without being reimplemented.
 */
export const ChatActionDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');

  const { navigate } = useNavigate();
  const { resolveIntent, isLoading } = useResolveIntent();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;

    if (node && messages.length > 0) {
      node.scrollTo({ top: node.scrollHeight });
    }
  }, [messages]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const text = input.trim();

      if (!text) {
        return;
      }

      const { reply, intent, ctaLabel } = runWorkflow(text);

      setMessages(previous => [
        ...previous,
        { id: previous.length, author: 'user', text },
        { id: previous.length + 1, author: 'bot', text: reply, intent, ctaLabel },
      ]);
      setInput('');
    },
    [input],
  );

  const handleAction = useCallback(
    (intent: ChatIntent) => {
      const resolved = resolveIntent(intent);

      if (!resolved) {
        setMessages(previous => [
          ...previous,
          {
            id: previous.length,
            author: 'bot',
            text: `I could not find a ${intent.symbol} market on this chain. Switch network and try again.`,
          },
        ]);
        return;
      }

      navigate(resolved.to);
      setIsOpen(false);
    },
    [resolveIntent, navigate],
  );

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        Ask Venus
      </Button>
    );
  }

  return (
    <div className="border-lightGrey bg-cards fixed bottom-6 right-6 z-50 flex h-[30rem] w-[22rem] flex-col overflow-hidden rounded-xl border shadow-2xl">
      <div className="border-lightGrey flex shrink-0 items-center justify-between border-b px-4 py-3">
        <p className="text-offWhite font-semibold">Ask Venus</p>

        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close">
          <Icon name="close" className="text-grey h-5 w-5" />
        </button>
      </div>

      <div ref={listRef} className="grow space-y-3 overflow-y-auto px-4 py-3">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn('flex', message.author === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                message.author === 'user'
                  ? 'bg-blue text-white'
                  : 'bg-dark-blue-active text-offWhite',
              )}
            >
              <p>{message.text}</p>

              {message.intent && (
                <Button
                  variant="secondary"
                  className="mt-2 w-full"
                  loading={isLoading}
                  onClick={() => handleAction(message.intent as ChatIntent)}
                >
                  {message.ctaLabel}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-lightGrey shrink-0 border-t p-3">
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="supply USDT"
          className="border-lightGrey bg-background text-offWhite placeholder:text-grey w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
      </form>
    </div>
  );
};
