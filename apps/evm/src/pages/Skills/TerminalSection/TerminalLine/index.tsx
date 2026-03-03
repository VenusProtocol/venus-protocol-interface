import type { TerminalLine as TerminalLineData } from '../../types';
import { getLineClassName } from './getLineClassName';
import { renderCompletedLine } from './renderCompletedLine';

interface TerminalLineProps {
  line: TerminalLineData;
}

export const TerminalLine: React.FC<TerminalLineProps> = ({ line }) => {
  const { item, text, isComplete } = line;

  if (item.type === 'blank') {
    return <div className="my-[6px]">&nbsp;</div>;
  }

  if (item.type === 'cursor') {
    return (
      <div className="my-[6px]">
        <span className="ml-1 inline-block h-[18px] w-2 animate-pulse align-text-bottom bg-green" />
      </div>
    );
  }

  if (item.type === 'user') {
    return (
      <div className={getLineClassName(item)}>
        <span className="mr-3 font-bold text-red">❯</span>
        {text}
      </div>
    );
  }

  return (
    <div className={getLineClassName(item)}>{isComplete ? renderCompletedLine(item) : text}</div>
  );
};
