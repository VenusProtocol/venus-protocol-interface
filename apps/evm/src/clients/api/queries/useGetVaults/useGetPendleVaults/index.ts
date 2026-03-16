import { useNow } from 'hooks/useNow';
import { useGetTokens } from 'libs/tokens';
import type { PendleVault } from 'types';
import { useGetVaultProducts } from '../../getVaultProducts/useGetVaultProducts';
import { useGetPools } from '../../useGetPools';
import { formatToPendleVaults } from './utils';

export interface UseGetPendleVaultsOutput {
  isLoading: boolean;
  data: PendleVault[] | undefined;
}

export const useGetPendleVaults = (): UseGetPendleVaultsOutput => {
  const { data: vaultProducts, isLoading: isVaultProductsLoading } = useGetVaultProducts();
  const { data: poolsData, isLoading: isPoolsLoading } = useGetPools();
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
