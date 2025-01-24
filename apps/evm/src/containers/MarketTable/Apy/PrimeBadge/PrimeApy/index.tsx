import type BigNumber from 'bignumber.js';

import { SenaryButton } from 'components';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';

import { cn } from 'utilities';
import { PrimeIcon } from '../PrimeIcon';

export interface PrimeApyProps extends React.HTMLAttributes<HTMLDivElement> {
  apyPercentage: BigNumber;
}

export const PrimeApy: React.FC<PrimeApyProps> = ({ apyPercentage, className, ...otherProps }) => {
  const readableApy = useFormatPercentageToReadableValue({
    value: apyPercentage,
  });

  return (
    <div className={cn('whitespace-nowrap', className)} {...otherProps}>
      <SenaryButton
        className="hover:border-lightGrey h-6 cursor-help rounded-full p-1 font-normal"
        onClick={e => e.stopPropagation()}
      >
        <PrimeIcon className="mr-1" />

        <span className="bg-[linear-gradient(26deg,_#674031_-49.72%,_#FFECE3_85.68%,_#6D4637_221.08%,_#FFECE3_383.56%)] bg-clip-text text-transparent">
          {readableApy}
        </span>
      </SenaryButton>
    </div>
  );
};
