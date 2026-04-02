import { useNow } from 'hooks/useNow';
import { useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';

import { useGetFixedRatedVaults } from 'clients/api';
import { useGetPools } from '../../useGetPools';
import { formatVaults } from './formatVaults';

export interface UseGetPendleVaultsOutput {
  isLoading: boolean;
  data: Vault[] | undefined;
}

export const useGetFormattedFixedRatedVaults = (): UseGetPendleVaultsOutput => {
  const { accountAddress } = useAccountAddress();
  const { data: vaultProducts, isLoading: isVaultProductsLoading } = useGetFixedRatedVaults();
  const { data: poolsData, isLoading: isPoolsLoading } = useGetPools({ accountAddress });

  const tokens = useGetTokens();

  const now = useNow();

  const isLoading = isVaultProductsLoading || isPoolsLoading;

  const data =
    vaultProducts && poolsData?.pools
      ? formatVaults({
          vaultProducts,
          pools: poolsData.pools,
          tokens,
          nowMs: now.getTime(),
        })
      : undefined;

  return {
    data,
    isLoading,
  };
};
