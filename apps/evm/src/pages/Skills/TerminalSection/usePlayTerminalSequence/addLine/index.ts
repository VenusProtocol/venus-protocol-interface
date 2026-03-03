import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react';

import type { SequenceItem, TerminalLine } from '../../../types';
import { appendLine } from '../appendLine';
import { getLineText } from '../getLineText';
import { scrollTerminalToBottom } from '../scrollTerminalToBottom';
import { typeWriter } from '../typeWriter';

interface AddLineInput {
  cancelledRef: { current: boolean };
  item: SequenceItem;
  linesRef: MutableRefObject<TerminalLine[]>;
  setTerminalLines: Dispatch<SetStateAction<TerminalLine[]>>;
  terminalRef: RefObject<HTMLDivElement | null>;
  timeoutIds: number[];
}

export const addLine = async ({
  cancelledRef,
  item,
  linesRef,
  setTerminalLines,
  terminalRef,
  timeoutIds,
}: AddLineInput) => {
  if (cancelledRef.current) {
    return;
  }

  const initialText = item.type === 'blank' ? '\u00A0' : '';
  const lineIndex = appendLine({
    line: {
      item,
      text: initialText,
      isComplete: item.type === 'blank' || item.type === 'cursor',
    },
    linesRef,
    setTerminalLines,
  });

  if (item.type === 'blank' || item.type === 'cursor') {
    scrollTerminalToBottom({ terminalRef });
    return;
  }

  await typeWriter({
    cancelledRef,
    fullText: getLineText(item),
    lineIndex,
    linesRef,
    setTerminalLines,
    terminalRef,
    timeoutIds,
  });
};
