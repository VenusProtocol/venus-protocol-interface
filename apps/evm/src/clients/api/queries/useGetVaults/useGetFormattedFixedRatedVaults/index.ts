import { useNow } from 'hooks/useNow';
import { useGetTokens } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import type { Vault } from 'types';

import { useGetFixedRatedVaultUserStakedTokens, useGetFixedRatedVaults } from 'clients/api';
import { useGetPools } from '../../useGetPools';
import { formatVaults } from './formatVaults';

export interface UseGetFormattedFixedRatedVaultsOutput {
  isLoading: boolean;
  data: Vault[] | undefined;
}

export const useGetFormattedFixedRatedVaults = (): UseGetFormattedFixedRatedVaultsOutput => {
  const { accountAddress } = useAccountAddress();
  const { data: vaultProducts, isLoading: isVaultProductsLoading } = useGetFixedRatedVaults();
  const { data: poolsData, isLoading: isPoolsLoading } = useGetPools({ accountAddress });

  const { data: userStakedAmounts, isLoading: isUserStakedTokensLoading } =
    useGetFixedRatedVaultUserStakedTokens({
      vaultAddresses: (vaultProducts ?? []).map(vaultProduct => vaultProduct.vaultAddress),
    });

  const tokens = useGetTokens();

  const now = useNow();

  const isLoading = isVaultProductsLoading || isPoolsLoading || isUserStakedTokensLoading;

  const data =
    vaultProducts && poolsData?.pools
      ? formatVaults({
          vaultProducts,
          pools: poolsData.pools,
          tokens,
          nowMs: now.getTime(),
          userStakedAmounts,
        })
      : undefined;

  return {
    data,
    isLoading,
  };
};
