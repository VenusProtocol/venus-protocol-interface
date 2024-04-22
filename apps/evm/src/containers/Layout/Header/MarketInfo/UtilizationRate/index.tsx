import { useGetVTokenUtilizationRate } from 'clients/api';
import type { Asset } from 'types';
import { formatPercentageToReadableValue } from 'utilities';

export interface UtilizationRateProps {
  asset: Asset;
  isIsolatedPoolMarket: boolean;
}

export const UtilizationRate: React.FC<UtilizationRateProps> = ({
  asset,
  isIsolatedPoolMarket,
}) => {
  const { data: getUtilizationRateData } = useGetVTokenUtilizationRate({
    asset,
    isIsolatedPoolMarket,
  });
  const utilizationRatePercentage = getUtilizationRateData?.utilizationRatePercentage;

  return formatPercentageToReadableValue(utilizationRatePercentage);
};
