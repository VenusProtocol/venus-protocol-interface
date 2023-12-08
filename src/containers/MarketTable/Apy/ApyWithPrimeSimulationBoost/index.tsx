import { Icon, Link, Tooltip } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { usePrimeCalculatorPagePath } from 'hooks/usePrimeCalculatorPagePath';
import { useTranslation } from 'packages/translations';
import { PrimeSimulationDistribution, Token } from 'types';

export interface ApyWithPrimeSimulationBoostProps {
  type: 'supply' | 'borrow';
  primeSimulationDistribution: PrimeSimulationDistribution;
  readableApy: string;
  readableLtv: string;
  xvs: Token;
}

export const ApyWithPrimeSimulationBoost: React.FC<ApyWithPrimeSimulationBoostProps> = ({
  type,
  primeSimulationDistribution,
  readableApy,
  readableLtv,
  xvs,
}) => {
  const { t, Trans } = useTranslation();
  const primeCalculatorPagePath = usePrimeCalculatorPagePath();
  const isPrimeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });

  const readablePrimeApy = useFormatPercentageToReadableValue({
    value: primeSimulationDistribution.apyPercentage,
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
        <p className="mr-1 inline-block align-middle text-sm text-green">
          {t('marketTable.apy.primeSimulationBoost.label', {
            apyPrimeBoost: `${type === 'supply' ? '+' : '-'}${readablePrimeApy}`,
          })}
        </p>

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
          <Icon name="info" />
        </Tooltip>
      </div>
    </div>
  );
};
