import { routes } from 'constants/routing';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

export const useProHomePath = () => {
  const { corePoolComptrollerContractAddress } = useChain();
  const isLiquidityHubEnabled = useIsFeatureEnabled({ name: 'liquidityHub' });

  if (isLiquidityHubEnabled) {
    return routes.liquidityHubs.path;
  }

  return routes.markets.path.replace(':poolComptrollerAddress', corePoolComptrollerContractAddress);
};
