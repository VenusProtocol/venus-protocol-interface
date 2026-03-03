import type { RefObject } from 'react';

interface ScrollTerminalToBottomInput {
  terminalRef: RefObject<HTMLDivElement | null>;
}

export const scrollTerminalToBottom = ({ terminalRef }: ScrollTerminalToBottomInput) => {
  if (!terminalRef.current) {
    return;
  }

  terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
};
