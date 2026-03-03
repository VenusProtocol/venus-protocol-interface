import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react';

import type { TerminalLine } from '../../../types';
import { schedule } from '../schedule';
import { scrollTerminalToBottom } from '../scrollTerminalToBottom';
import { updateLine } from '../updateLine';

interface TypeWriterInput {
  cancelledRef: { current: boolean };
  fullText: string;
  lineIndex: number;
  linesRef: MutableRefObject<TerminalLine[]>;
  setTerminalLines: Dispatch<SetStateAction<TerminalLine[]>>;
  terminalRef: RefObject<HTMLDivElement | null>;
  timeoutIds: number[];
}

export const typeWriter = async ({
  cancelledRef,
  fullText,
  lineIndex,
  linesRef,
  setTerminalLines,
  terminalRef,
  timeoutIds,
}: TypeWriterInput) => {
  let charIndex = 0;

  while (!cancelledRef.current && charIndex < fullText.length) {
    charIndex += 1;

    updateLine({
      lineIndex,
      linesRef,
      setTerminalLines,
      update: { text: fullText.slice(0, charIndex) },
    });

    scrollTerminalToBottom({ terminalRef });
    await schedule(10, timeoutIds);
  }

  updateLine({
    lineIndex,
    linesRef,
    setTerminalLines,
    update: { isComplete: true },
  });
};
