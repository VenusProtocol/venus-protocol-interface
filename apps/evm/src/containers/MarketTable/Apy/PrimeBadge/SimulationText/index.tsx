import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { PrimeSimulationDistribution, Token } from 'types';

export interface SimulationTextProps {
  token: Token;
  referenceValues: PrimeSimulationDistribution['referenceValues'];
}

export const SimulationText: React.FC<SimulationTextProps> = ({ token, referenceValues }) => {
  const { t } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const readableReferenceXvsStaked = useFormatTokensToReadableValue({
    value: referenceValues?.userXvsStakedTokens,
    token: xvs,
    addSymbol: true,
  });

  const readableReferenceSupplyBalance = useFormatTokensToReadableValue({
    value: referenceValues?.userSupplyBalanceTokens,
    token,
    addSymbol: true,
  });

  const readableReferenceBorrowBalance = useFormatTokensToReadableValue({
    value: referenceValues?.userBorrowBalanceTokens,
    token,
    addSymbol: true,
  });

  return t('marketTable.apy.primeBadge.tooltip.primeSimulation', {
    supplyBalance: readableReferenceSupplyBalance,
    borrowBalance: readableReferenceBorrowBalance,
    xvsStaked: readableReferenceXvsStaked,
  });
};
