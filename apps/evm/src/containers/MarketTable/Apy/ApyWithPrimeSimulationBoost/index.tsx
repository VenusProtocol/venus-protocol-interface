import BigNumber from 'bignumber.js';

import { SenaryButton, Tooltip } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import { Link } from 'containers/Link';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { usePrimeCalculatorPagePath } from 'hooks/usePrimeCalculatorPagePath';
import { useTranslation } from 'packages/translations';
import { PrimeSimulationDistribution, Token } from 'types';

import primeLogoSrc from './primeLogo.svg';

export interface ApyWithPrimeSimulationBoostProps {
  type: 'supply' | 'borrow';
  tokenAddress: string;
  primeSimulationDistribution: PrimeSimulationDistribution;
  apyPercentage: BigNumber;
  readableLtv: string;
  xvs: Token;
}

export const ApyWithPrimeSimulationBoost: React.FC<ApyWithPrimeSimulationBoostProps> = ({
  type,
  tokenAddress,
  primeSimulationDistribution,
  apyPercentage,
  readableLtv,
  xvs,
}) => {
  const { t, Trans } = useTranslation();
  const primeCalculatorPagePath = usePrimeCalculatorPagePath({ tokenAddress });
  const isPrimeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });

  const readableApy = useFormatPercentageToReadableValue({
    value: apyPercentage,
  });

  const readableApyWithPrime = useFormatPercentageToReadableValue({
    value:
      type === 'borrow'
        ? apyPercentage.minus(primeSimulationDistribution.apyPercentage)
        : apyPercentage.plus(primeSimulationDistribution.apyPercentage),
  });

  const readableReferenceXvsStaked = useFormatTokensToReadableValue({
    value: primeSimulationDistribution.referenceValues.userXvsStakedTokens,
    token: xvs,
    addSymbol: true,
  });

  const readableReferenceSupplyBalance = useFormatTokensToReadableValue({
    value: primeSimulationDistribution.referenceValues.userSupplyBalanceTokens,
    token: primeSimulationDistribution.token,
    addSymbol: true,
  });

  const readableReferenceBorrowBalance = useFormatTokensToReadableValue({
    value: primeSimulationDistribution.referenceValues.userBorrowBalanceTokens,
    token: primeSimulationDistribution.token,
    addSymbol: true,
  });

  const values = {
    supplyBalance: readableReferenceSupplyBalance,
    borrowBalance: readableReferenceBorrowBalance,
    xvsStaked: readableReferenceXvsStaked,
  };

  return (
    <div>
      <p className="text-sm">
        {readableApy}{' '}
        <span className="text-sm text-grey">{type === 'supply' && <>/ {readableLtv}</>}</span>
      </p>

      <div className="whitespace-nowrap">
        <Tooltip
          className="inline-block align-middle"
          title={
            isPrimeCalculatorEnabled ? (
              <Trans
                i18nKey="marketTable.apy.primeSimulationBoost.tooltip.primeCalculator"
                values={values}
                components={{
                  Link: <Link to={primeCalculatorPagePath} onClick={e => e.stopPropagation()} />,
                }}
              />
            ) : (
              <Trans
                i18nKey="marketTable.apy.primeSimulationBoost.tooltip.primeDoc"
                values={values}
                components={{
                  Link: <Link href={PRIME_DOC_URL} onClick={e => e.stopPropagation()} />,
                }}
              />
            )
          }
        >
          <SenaryButton
            className="h-6 cursor-help rounded-full p-1 hover:border-lightGrey"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={primeLogoSrc}
              className="mr-1 h-4"
              alt={t('marketTable.apy.primeSimulationBoost.primeLogoAlt')}
            />

            <span className="text-green">{readableApyWithPrime}</span>
          </SenaryButton>
        </Tooltip>
      </div>
    </div>
  );
};
