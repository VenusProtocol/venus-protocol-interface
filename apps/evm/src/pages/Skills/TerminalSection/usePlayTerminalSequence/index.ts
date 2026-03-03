import { type RefObject, useEffect, useRef, useState } from 'react';

import type { SequenceItem, TerminalLine } from '../../types';
import { playSequence } from './playSequence';

interface UsePlayTerminalSequenceInput {
  terminalRef: RefObject<HTMLDivElement | null>;
  sequence: SequenceItem[];
}

export const usePlayTerminalSequence = ({
  terminalRef,
  sequence,
}: UsePlayTerminalSequenceInput) => {
  const linesRef = useRef<TerminalLine[]>([]);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    const cancelledRef = { current: false };
    const timeoutIds: number[] = [];

    void playSequence({
      cancelledRef,
      linesRef,
      sequence,
      setTerminalLines,
      terminalRef,
      timeoutIds,
    });

    return () => {
      cancelledRef.current = true;
      timeoutIds.forEach(window.clearTimeout);
    };
  }, [sequence, terminalRef]);

  return terminalLines;
};
