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
        'hover:border-lightGrey h-6 rounded-full p-1 whitespace-nowrap font-semibold shrink-0',
        className,
      )}
      {...otherProps}
    >
      <PrimeIcon className="mr-1" />

      <span className="bg-[linear-gradient(26deg,#674031_-49.72%,#FFECE3_85.68%,#6D4637_221.08%,#FFECE3_383.56%)] bg-clip-text text-transparent">
        {readableApy}
      </span>
    </SenaryButton>
  );
};
