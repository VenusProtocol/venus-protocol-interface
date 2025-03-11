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
        'hover:border-lightGrey h-6 rounded-full p-1 font-normal whitespace-nowrap',
        className,
      )}
      {...otherProps}
    >
      <PrimeIcon className="mr-1" />

      <span className="bg-[linear-gradient(26deg,_#674031_-49.72%,_#FFECE3_85.68%,_#6D4637_221.08%,_#FFECE3_383.56%)] bg-clip-text text-transparent">
        {readableApy}
      </span>
    </SenaryButton>
  );
};
