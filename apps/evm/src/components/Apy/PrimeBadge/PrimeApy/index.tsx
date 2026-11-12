import type BigNumber from 'bignumber.js';

import { type ButtonProps, SenaryButton } from 'components';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';

import { cn } from '@venusprotocol/ui';
import { PrimeIcon } from '../PrimeIcon';

export interface PrimeApyProps extends Omit<ButtonProps, 'onClick'> {
  apyPercentage: BigNumber;
}

export const PrimeApy: React.FC<PrimeApyProps> = ({ apyPercentage, className, ...otherProps }) => {
  const readableApy = useFormatPercentageToReadableValue({
    value: apyPercentage,
  });

  return (
    <SenaryButton
      className={cn(
        'prime-badge-ring isolate h-auto shrink-0 rounded-full border-0 bg-transparent bg-none px-1 py-0.5 text-sm font-normal whitespace-nowrap shadow-none backdrop-blur-none before:hidden hover:bg-prime-hover active:bg-prime-active',
        className,
      )}
      {...otherProps}
    >
      <PrimeIcon className="mr-1" />

      <span className="bg-prime-text bg-clip-text text-transparent">{readableApy}</span>
    </SenaryButton>
  );
};
