import { useCallback, useEffect } from 'react';

import { SUPPORT_CHAT_API_URL } from '../config';
import { useStore } from '../store';
import type { ChatMessage } from '../types';

const CONVERSATION_ID_STORAGE_KEY = 'venus-chat-conversation-id';
const POLL_INTERVAL_MS = 1000;
const MAX_POLL_COUNT = 90;
const HEARTBEAT_INTERVAL_MS = 15000;

const WELCOME_MESSAGE: Omit<ChatMessage, 'id'> = {
  role: 'bot',
  text: "Hi! I'm the Venus assistant. Ask me anything about supplying, borrowing, vaults, XVS or Venus Prime.",
  animate: true,
  ctas: [
    {
      label: 'Best stablecoin yield?',
      prompt: 'Where can I get the best stablecoin yield on Venus right now?',
    },
    { label: 'What are fixed-rate vaults?', prompt: 'What are fixed-rate vaults on Venus?' },
    { label: 'What can I do with Venus?', prompt: 'What can I do with Venus?' },
  ],
};

const sleep = (durationMs: number) => new Promise(resolve => setTimeout(resolve, durationMs));

const callApi = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${SUPPORT_CHAT_API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  let body: any;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }
  return { status: response.status, body };
};

export interface UseChatConversationOutput {
  messages: ChatMessage[];
  isBusy: boolean;
  isSessionAlive: boolean;
  sendMessage: (text: string) => Promise<void>;
  restartSession: () => Promise<void>;
}

export const useChatConversation = (): UseChatConversationOutput => {
  const { messages, isBusy, isSessionAlive, isOpen } = useStore();

  const handleClosedSession = useCallback((payload?: { message?: string }) => {
    const { appendMessage, setIsSessionAlive, setIsBusy } = useStore.getState();
    sessionStorage.removeItem(CONVERSATION_ID_STORAGE_KEY);
    setIsSessionAlive(false);
    setIsBusy(false);
    appendMessage({
      role: 'notice',
      text:
        payload?.message ||
        'This conversation is no longer active. Please start a new conversation.',
      showRestart: true,
    });
  }, []);

  const startSession = useCallback(async () => {
    const { appendMessage, setIsSessionAlive } = useStore.getState();

    let conversationId = sessionStorage.getItem(CONVERSATION_ID_STORAGE_KEY);
    if (!conversationId) {
      conversationId = crypto.randomUUID();
      sessionStorage.setItem(CONVERSATION_ID_STORAGE_KEY, conversationId);
    }

    let response = await callApi('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ conversationId }),
    });

    // Stale ID from a closed session: mint a fresh one and handshake again
    if (response.status === 410) {
      conversationId = crypto.randomUUID();
      sessionStorage.setItem(CONVERSATION_ID_STORAGE_KEY, conversationId);
      response = await callApi('/api/conversations', {
        method: 'POST',
        body: JSON.stringify({ conversationId }),
      });
    }

    if (response.status !== 201) {
      appendMessage({
        role: 'notice',
        text: 'Could not reach the assistant. Is the chat backend running?',
      });
      return;
    }

    setIsSessionAlive(true);
  }, []);

  const pollJob = useCallback(
    async (jobId: string) => {
      const { appendMessage, setIsBusy } = useStore.getState();
      const conversationId = sessionStorage.getItem(CONVERSATION_ID_STORAGE_KEY);

      for (let attempt = 0; attempt < MAX_POLL_COUNT; attempt++) {
        await sleep(POLL_INTERVAL_MS);
        if (!useStore.getState().isSessionAlive) {
          return;
        }

        const { status, body } = await callApi(
          `/api/conversations/${conversationId}/jobs/${jobId}`,
        );
        if (status === 410) {
          handleClosedSession(body);
          return;
        }
        if (status === 200 && body.status === 'done') {
          appendMessage({
            role: 'bot',
            text: body.reply.text,
            ctas: body.reply.ctas,
            animate: true,
          });
          setIsBusy(false);
          return;
        }
      }

      appendMessage({
        role: 'notice',
        text: 'The assistant is taking longer than expected. Please try again.',
      });
      setIsBusy(false);
    },
    [handleClosedSession],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const { appendMessage, setIsBusy } = useStore.getState();
      const trimmedText = text.trim();
      if (!trimmedText || useStore.getState().isBusy || !useStore.getState().isSessionAlive) {
        return;
      }

      appendMessage({ role: 'user', text: trimmedText });
      setIsBusy(true);

      const conversationId = sessionStorage.getItem(CONVERSATION_ID_STORAGE_KEY);
      const { status, body } = await callApi(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text: trimmedText }),
      });

      if (status === 410) {
        handleClosedSession(body);
        return;
      }
      if (status !== 202) {
        appendMessage({ role: 'notice', text: 'Something went wrong. Please try again.' });
        setIsBusy(false);
        return;
      }

      await pollJob(body.jobId);
    },
    [handleClosedSession, pollJob],
  );

  const restartSession = useCallback(async () => {
    await startSession();
    if (useStore.getState().isSessionAlive) {
      useStore.getState().appendMessage(WELCOME_MESSAGE);
    }
  }, [startSession]);

  // Handshake + greeting on first open
  useEffect(() => {
    if (!isOpen || useStore.getState().hasGreeted) {
      return;
    }
    useStore.getState().setHasGreeted(true);

    const initialize = async () => {
      await startSession();
      if (useStore.getState().isSessionAlive) {
        useStore.getState().appendMessage(WELCOME_MESSAGE);
      }
    };
    initialize();
  }, [isOpen, startSession]);

  // Heartbeat: surfaces backend-initiated closes (idle timeout) while open
  useEffect(() => {
    if (!isOpen || !isSessionAlive) {
      return;
    }

    const intervalId = setInterval(async () => {
      const conversationId = sessionStorage.getItem(CONVERSATION_ID_STORAGE_KEY);
      if (!conversationId) {
        return;
      }
      try {
        const { status, body } = await callApi(`/api/conversations/${conversationId}`);
        if (status === 410) {
          handleClosedSession(body);
        }
      } catch {
        // transient network blip — keep the session, retry next beat
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isOpen, isSessionAlive, handleClosedSession]);

  // Tab closing: tell the backend so it and the bot discard all state
  useEffect(() => {
    const handlePageHide = () => {
      const conversationId = sessionStorage.getItem(CONVERSATION_ID_STORAGE_KEY);
      if (conversationId && useStore.getState().isSessionAlive) {
        navigator.sendBeacon(`${SUPPORT_CHAT_API_URL}/api/conversations/${conversationId}/close`);
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);

  return { messages, isBusy, isSessionAlive, sendMessage, restartSession };
};
