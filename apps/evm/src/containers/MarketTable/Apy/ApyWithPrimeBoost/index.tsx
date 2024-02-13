import BigNumber from 'bignumber.js';

import { Icon, Tooltip } from 'components';
import { Link } from 'containers/Link';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import { usePrimeCalculatorPagePath } from 'hooks/usePrimeCalculatorPagePath';
import { useTranslation } from 'libs/translations';

export interface ApyWithPrimeBoostProps {
  type: 'supply' | 'borrow';
  tokenAddress: string;
  apyPercentage: BigNumber;
  apyPercentageWithoutPrimeBoost: BigNumber;
  readableLtv: string;
}

export const ApyWithPrimeBoost: React.FC<ApyWithPrimeBoostProps> = ({
  type,
  tokenAddress,
  apyPercentage,
  apyPercentageWithoutPrimeBoost,
  readableLtv,
}) => {
  const { Trans } = useTranslation();
  const primeCalculatorPagePath = usePrimeCalculatorPagePath({ tokenAddress });

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
          <span className="text-green inline-block align-baseline text-base font-semibold">
            {readableApy}
          </span>
        </p>

        <Tooltip
          className="inline-block align-middle"
          title={
            <Trans
              i18nKey="marketTable.apy.primeBoost.tooltip"
              components={{
                Link: <Link to={primeCalculatorPagePath} onClick={e => e.stopPropagation()} />,
              }}
            />
          }
        >
          <Icon name="info" />
        </Tooltip>
      </div>

      {type === 'supply' && <p className="text-grey text-xs">{readableLtv}</p>}
    </div>
  );
};
