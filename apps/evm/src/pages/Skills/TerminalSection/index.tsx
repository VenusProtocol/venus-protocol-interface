import { useMemo, useRef } from 'react';

import { useTranslation } from 'libs/translations';

import { TerminalControlDot } from './TerminalControlDot';
import { TerminalLine } from './TerminalLine';
import { getSequence } from './getSequence';
import { usePlayTerminalSequence } from './usePlayTerminalSequence';

export const TerminalSection: React.FC = () => {
  const { t } = useTranslation();
  const terminalRef = useRef<HTMLDivElement>(null);
  const sequence = useMemo(() => getSequence(t), [t]);
  const terminalLines = usePlayTerminalSequence({
    terminalRef,
    sequence,
  });

  return (
    <div className="mb-20">
      <div className="mx-auto overflow-hidden rounded-2xl border border-blue bg-background font-mono shadow-2xl">
        <div className="flex items-center border-b border-b-light-grey/20 px-5 py-[14px]">
          <div className="mr-5 flex gap-2">
            <TerminalControlDot variant="red" />
            <TerminalControlDot variant="yellow" />
            <TerminalControlDot variant="green" />
          </div>

          <div className="text-sm font-medium text-light-grey">
            {t('skillsPage.terminal.title')}
          </div>
        </div>

        <div
          className="h-[50vh] overflow-y-auto bg-background-active p-7 text-sm leading-[1.7] scrollbar-thin scrollbar-track-black scrollbar-thumb-light-grey md:h-[70vh]"
          ref={terminalRef}
        >
          {terminalLines.map((line, index) => (
            <TerminalLine key={`${index}-${line.item.type}`} line={line} />
          ))}
        </div>
      </div>
    </div>
  );
};
