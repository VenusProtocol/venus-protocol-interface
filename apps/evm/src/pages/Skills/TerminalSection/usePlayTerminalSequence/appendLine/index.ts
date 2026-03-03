import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

import type { TerminalLine } from '../../../types';

interface AppendLineInput {
  line: TerminalLine;
  linesRef: MutableRefObject<TerminalLine[]>;
  setTerminalLines: Dispatch<SetStateAction<TerminalLine[]>>;
}

export const appendLine = ({ line, linesRef, setTerminalLines }: AppendLineInput) => {
  const nextLines = [...linesRef.current, line];
  linesRef.current = nextLines;
  setTerminalLines(nextLines);

  return nextLines.length - 1;
};
