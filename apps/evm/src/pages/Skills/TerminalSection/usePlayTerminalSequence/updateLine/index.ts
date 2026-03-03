import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

import type { TerminalLine } from '../../../types';

interface UpdateLineInput {
  lineIndex: number;
  linesRef: MutableRefObject<TerminalLine[]>;
  setTerminalLines: Dispatch<SetStateAction<TerminalLine[]>>;
  update: Partial<TerminalLine>;
}

export const updateLine = ({ lineIndex, linesRef, setTerminalLines, update }: UpdateLineInput) => {
  const line = linesRef.current[lineIndex];

  if (!line) {
    return;
  }

  const nextLines = [...linesRef.current];
  nextLines[lineIndex] = {
    ...line,
    ...update,
  };
  linesRef.current = nextLines;
  setTerminalLines(nextLines);
};
