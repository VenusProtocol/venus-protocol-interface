import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react';

import type { SequenceItem, TerminalLine } from '../../../types';
import { addLine } from '../addLine';
import { schedule } from '../schedule';

interface PlaySequenceInput {
  cancelledRef: { current: boolean };
  linesRef: MutableRefObject<TerminalLine[]>;
  sequence: SequenceItem[];
  setTerminalLines: Dispatch<SetStateAction<TerminalLine[]>>;
  terminalRef: RefObject<HTMLDivElement | null>;
  timeoutIds: number[];
}

export const playSequence = async ({
  cancelledRef,
  linesRef,
  sequence,
  setTerminalLines,
  terminalRef,
  timeoutIds,
}: PlaySequenceInput) => {
  linesRef.current = [];
  setTerminalLines([]);

  await schedule(500, timeoutIds);

  for (const item of sequence) {
    if (cancelledRef.current) {
      return;
    }

    await addLine({
      cancelledRef,
      item,
      linesRef,
      setTerminalLines,
      terminalRef,
      timeoutIds,
    });
  }
};
