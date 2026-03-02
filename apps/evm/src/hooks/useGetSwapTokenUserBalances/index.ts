import { useGetPool } from 'clients/api';
import type { TokenBalance } from 'types';

import { convertTokensToMantissa } from 'utilities';
import type { Address } from 'viem';

export const useGetSwapTokenUserBalances = ({
  poolComptrollerContractAddress,
  accountAddress,
}: {
  poolComptrollerContractAddress: Address;
  accountAddress?: Address;
}) => {
  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: poolComptrollerContractAddress,
    accountAddress,
  });

  const data = getPoolData?.pool.assets
    ? getPoolData?.pool.assets.reduce<TokenBalance[]>((acc, poolAsset) => {
        // Filter out paused assets
        if (
          poolAsset.disabledTokenActions.includes('supply') ||
          poolAsset.disabledTokenActions.includes('repay')
        ) {
          return acc;
        }

        const tokenBalance: TokenBalance = {
          token: poolAsset.vToken.underlyingToken,
          balanceMantissa: convertTokensToMantissa({
            token: poolAsset.vToken.underlyingToken,
            value: poolAsset.userWalletBalanceTokens,
          }),
        };

        return [...acc, tokenBalance];
      }, [])
    : undefined;

  return {
    data,
  };
};
