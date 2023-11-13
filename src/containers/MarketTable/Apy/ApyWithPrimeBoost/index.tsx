import BigNumber from 'bignumber.js';
import { Icon, Tooltip } from 'components';
import { useTranslation } from 'packages/translations';

import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';

export interface ApyWithPrimeBoostProps {
  type: 'supply' | 'borrow';
  apyPercentage: BigNumber;
  apyPercentageWithoutPrimeBoost: BigNumber;
  readableLtv: string;
}

export const ApyWithPrimeBoost: React.FC<ApyWithPrimeBoostProps> = ({
  type,
  apyPercentage,
  apyPercentageWithoutPrimeBoost,
  readableLtv,
}) => {
  const { t } = useTranslation();

  const readableApy = useFormatPercentageToReadableValue({
    value: apyPercentage,
  });

  const readableApyWithoutPrime = useFormatPercentageToReadableValue({
    value: apyPercentageWithoutPrimeBoost,
  });

  return (
    <div>
      <div className="whitespace-nowrap">
        <p className="mr-1 inline-block align-middle">
          <span className="inline-block align-baseline text-sm line-through">
            {readableApyWithoutPrime}
          </span>{' '}
          <span className="inline-block align-baseline text-base font-semibold text-green">
            {readableApy}
          </span>
        </p>

        <Tooltip
          className="inline-block align-middle"
          title={t('marketTable.apy.primeBoost.tooltip')}
        >
          <Icon name="info" />
        </Tooltip>
      </div>

      {type === 'supply' && <p className="text-xs text-grey">{readableLtv}</p>}
    </div>
  );
};
