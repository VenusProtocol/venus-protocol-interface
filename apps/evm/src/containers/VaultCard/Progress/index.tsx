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
}

export const Progress: React.FC<ProgressProps> = ({
  token,
  amountTokens,
  maxTokens,
  className,
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

  return (
    <div className={cn('text-b1r', className)}>
      <div className="text-right">
        {readableAmount} / {readableMax}
      </div>

      <div className="flex items-center justify-end gap-x-3">
        <div className="w-25 grow h-2 rounded-full overflow-hidden bg-dark-grey">
          <div
            className="h-full rounded-full bg-green"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="shrink-0">{readablePercentage}</div>
      </div>
    </div>
  );
};
