import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { PrimeSimulationDistribution, Token } from 'types';
import { formatTokensToReadableValue } from 'utilities';

export interface SimulationTextProps {
  token: Token;
  type: 'supply' | 'borrow';
  referenceValues: PrimeSimulationDistribution['referenceValues'];
  isLiquidityHub?: boolean;
}

export const SimulationText: React.FC<SimulationTextProps> = ({
  token,
  type,
  referenceValues,
  isLiquidityHub = false,
}) => {
  const { t, Trans } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const readableReferenceXvsStaked = formatTokensToReadableValue({
    value: referenceValues?.userXvsStakedTokens,
    token: xvs,
    addSymbol: true,
  });

  const components = {
    PrimeLink: <Link to={routes.primeLeaderboard.path} onClick={e => e.stopPropagation()} />,
  };

  if (type === 'supply') {
    const readableReferenceSupplyBalance = formatTokensToReadableValue({
      value: referenceValues?.userSupplyBalanceTokens,
      token,
      addSymbol: true,
    });

    return (
      <>
        <Trans
          i18nKey="apy.primeBadge.tooltip.primeSupplySimulation"
          values={{
            supplyBalance: readableReferenceSupplyBalance,
            xvsStaked: readableReferenceXvsStaked,
          }}
          components={components}
        />

        {isLiquidityHub && ` ${t('apy.primeBadge.tooltip.liquidityHubCorePoolBoost')}`}
      </>
    );
  }

  const readableReferenceBorrowBalance = formatTokensToReadableValue({
    value: referenceValues?.userBorrowBalanceTokens,
    token,
    addSymbol: true,
  });

  return (
    <Trans
      i18nKey="apy.primeBadge.tooltip.primeBorrowSimulation"
      values={{
        borrowBalance: readableReferenceBorrowBalance,
        xvsStaked: readableReferenceXvsStaked,
      }}
      components={components}
    />
  );
};
