import type { Address } from 'viem';

import { routes } from 'constants/routing';
import { useFormatTo } from 'hooks/useFormatTo';
import { TAB_PARAM_KEY } from 'hooks/useTabs';

export const useMarketPageTo = () => {
  const { formatTo } = useFormatTo();

  const formatMarketPageTo = ({
    poolComptrollerContractAddress,
    vTokenAddress,
    tabId = 'supply',
  }: { poolComptrollerContractAddress: Address; vTokenAddress: Address; tabId?: string }) => {
    const pathname = routes.market.path
      .replace(':poolComptrollerAddress', poolComptrollerContractAddress)
      .replace(':vTokenAddress', vTokenAddress);

    return formatTo({
      to: {
        pathname,
        search: `${TAB_PARAM_KEY}=${tabId}`,
      },
    });
  };

  return { formatMarketPageTo };
};
