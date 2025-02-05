import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { PrimeSimulationDistribution, Token } from 'types';
import { formatTokensToReadableValue } from 'utilities';

export interface SimulationTextProps {
  token: Token;
  type: 'supply' | 'borrow';
  referenceValues: PrimeSimulationDistribution['referenceValues'];
}

export const SimulationText: React.FC<SimulationTextProps> = ({ token, type, referenceValues }) => {
  const { t } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const readableReferenceXvsStaked = formatTokensToReadableValue({
    value: referenceValues?.userXvsStakedTokens,
    token: xvs,
    addSymbol: true,
  });

  if (type === 'supply') {
    const readableReferenceSupplyBalance = formatTokensToReadableValue({
      value: referenceValues?.userSupplyBalanceTokens,
      token,
      addSymbol: true,
    });

    return t('apy.primeBadge.tooltip.primeSupplySimulation', {
      supplyBalance: readableReferenceSupplyBalance,
      xvsStaked: readableReferenceXvsStaked,
    });
  }

  const readableReferenceBorrowBalance = formatTokensToReadableValue({
    value: referenceValues?.userBorrowBalanceTokens,
    token,
    addSymbol: true,
  });

  return t('apy.primeBadge.tooltip.primeBorrowSimulation', {
    borrowBalance: readableReferenceBorrowBalance,
    xvsStaked: readableReferenceXvsStaked,
  });
};
