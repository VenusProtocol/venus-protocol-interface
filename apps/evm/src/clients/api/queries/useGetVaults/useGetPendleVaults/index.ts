import { useNow } from 'hooks/useNow';
import { useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import type { PendleVault } from 'types';

import { useGetFixedRatedVaults } from 'clients/api';
import { useGetPools } from '../../useGetPools';
import { formatToPendleVaults } from './utils';

export interface UseGetPendleVaultsOutput {
  isLoading: boolean;
  data: PendleVault[] | undefined;
}

export const useGetPendleVaults = (): UseGetPendleVaultsOutput => {
  const { accountAddress } = useAccountAddress();
  const { data: vaultProducts, isLoading: isVaultProductsLoading } = useGetFixedRatedVaults();
  const { data: poolsData, isLoading: isPoolsLoading } = useGetPools({ accountAddress });

  const tokens = useGetTokens();

  const now = useNow().getTime();

  const isLoading = isVaultProductsLoading || isPoolsLoading;

  const data =
    vaultProducts && poolsData?.pools
      ? formatToPendleVaults({
          vaultProducts,
          pools: poolsData.pools,
          tokens,
          now,
        })
      : undefined;

  return {
    data,
    isLoading,
  };
};
