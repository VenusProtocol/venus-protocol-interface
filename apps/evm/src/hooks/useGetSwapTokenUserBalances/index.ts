import type { Address } from 'viem';

import { useGetPool } from 'clients/api';
import type { OptionalTokenBalance } from 'containers/TokenListWrapper';
import { convertTokensToMantissa } from 'utilities';

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
    ? getPoolData?.pool.assets.reduce<OptionalTokenBalance[]>((acc, poolAsset) => {
        // Filter out restricted assets
        if (poolAsset.isRestricted) {
          return acc;
        }

        const tokenBalance: OptionalTokenBalance = {
          token: poolAsset.vToken.underlyingToken,
          balanceMantissa: convertTokensToMantissa({
            token: poolAsset.vToken.underlyingToken,
            value: poolAsset.userWalletBalanceTokens,
          }),
          isGated: poolAsset.isGated,
        };

        return [...acc, tokenBalance];
      }, [])
    : undefined;

  return {
    data,
  };
};
