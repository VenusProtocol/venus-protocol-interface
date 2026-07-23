import { cn } from '@venusprotocol/ui';

import { Tooltip, type TooltipProps } from '../Tooltip';
import { getProgressBarValuePercentage } from './getProgressBarValuePercentage';

export interface ProgressBarData {
  value: number;
  className?: string;
}

export interface ProgressBarMark {
  value: number;
  className?: string;
}

export interface ProgressBarProps {
  progressBars: ProgressBarData[];
  marks?: ProgressBarMark[];
  min: number;
  max: number;
  tooltip?: TooltipProps['content'];
  className?: string;
}

export const ProgressBar = ({
  progressBars,
  marks,
  min,
  max,
  tooltip,
  className,
}: ProgressBarProps) => {
  const dom = (
    <div className={cn('relative h-2 w-full rounded-full overflow-hidden bg-lightGrey', className)}>
      {progressBars.map((progressBar, index) => {
        const valuePercentage = getProgressBarValuePercentage({
          value: progressBar.value,
          min,
          max,
        });

        return (
          <div
            key={index}
            className={cn('absolute inset-y-0 left-0 rounded-full bg-green', progressBar.className)}
            style={{ width: `${valuePercentage}%` }}
          />
        );
      })}

      {marks?.map((mark, index) => {
        const valuePercentage = getProgressBarValuePercentage({ value: mark.value, min, max });

        return (
          <span
            key={index}
            className={cn(
              'absolute top-1/2 z-30 h-2 w-1 -translate-x-px -translate-y-1/2 rounded-sm bg-red',
              mark.className,
            )}
            style={{ left: `${valuePercentage}%` }}
          />
        );
      })}
    </div>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{dom}</Tooltip>;
  }

  return dom;
};
