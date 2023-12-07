import { Icon, Link, Tooltip } from 'components';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { usePrimeSimulationPagePath } from 'hooks/usePrimeSimulationPagePath';
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
  const primeSimulationPageUrl = usePrimeSimulationPagePath();

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
            <Trans
              i18nKey="marketTable.apy.primeSimulationBoost.tooltip"
              values={{
                supplyBalance: readableReferenceSupplyBalance,
                borrowBalance: readableReferenceBorrowBalance,
                xvsStaked: readableReferenceXvsStaked,
              }}
              components={{
                Link: <Link to={primeSimulationPageUrl} onClick={e => e.stopPropagation()} />,
              }}
            />
          }
        >
          <Icon name="info" />
        </Tooltip>
      </div>
    </div>
  );
};
