import { cn } from '@venusprotocol/ui';

import type { Token } from 'types';
import {
  calculatePercentage,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface ProgressProps {
  token: Token;
  amountTokens: BigNumber;
  maxTokens: BigNumber;
  className?: string;
  progressBarClassName?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  token,
  amountTokens,
  maxTokens,
  className,
  progressBarClassName,
}) => {
  let percentage = calculatePercentage({
    numerator: amountTokens.toNumber(),
    denominator: maxTokens.toNumber(),
  });

  if (percentage > 100) {
    percentage = 100;
  }

  const readablePercentage = formatPercentageToReadableValue(percentage);

  const readableAmount = formatTokensToReadableValue({
    value: amountTokens,
    token,
  });

  const readableMax = formatTokensToReadableValue({
    value: maxTokens,
    token,
  });

  const progressBarColorClassName = percentage >= 80 ? 'bg-green' : 'bg-blue';

  return (
    <div className={cn('text-b1r', className)}>
      <div className="text-right">
        {readableAmount} / {readableMax}
      </div>

      <div className="flex items-center justify-end gap-x-3">
        <div className="w-25 grow h-2 rounded-full overflow-hidden bg-dark-grey">
          <div
            className={cn('h-full rounded-full', progressBarColorClassName, progressBarClassName)}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="shrink-0">{readablePercentage}</div>
      </div>
    </div>
  );
};
