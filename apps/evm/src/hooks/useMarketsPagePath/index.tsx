import { routes } from 'constants/routing';
import { useChain } from 'hooks/useChain';

export const useMarketsPagePath = () => {
  const { corePoolComptrollerContractAddress } = useChain();

  const marketsPagePath = routes.markets.path.replace(
    ':poolComptrollerAddress',
    corePoolComptrollerContractAddress,
  );

  return { marketsPagePath };
};
