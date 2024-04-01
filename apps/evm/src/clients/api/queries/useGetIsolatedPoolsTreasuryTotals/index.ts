import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  type GetVTokenBalancesAllOutput,
  useGetIsolatedPools,
  useGetVTokenBalancesAll,
} from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { getVTreasuryContractAddress, getVTreasuryV8ContractAddress } from 'libs/contracts';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { areAddressesEqual, convertMantissaToTokens, indexBy } from 'utilities';

export interface Data {
  treasurySupplyBalanceCents: BigNumber;
  treasuryBorrowBalanceCents: BigNumber;
  treasuryBalanceCents: BigNumber;
  treasuryLiquidityBalanceCents: BigNumber;
}

export interface UseGetIsolatedPoolsTreasuryTotalsOutput {
  isLoading: boolean;
  data: Data;
}

const useGetIsolatedPoolsTreasuryTotals = (): UseGetIsolatedPoolsTreasuryTotalsOutput => {
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();
  const { corePoolComptrollerContractAddress, lidoPoolComptrollerContractAddress } =
    useGetChainMetadata();
  const treasuryAddress = useMemo(() => {
    switch (chainId) {
      case ChainId.BSC_MAINNET:
      case ChainId.BSC_TESTNET:
        return getVTreasuryContractAddress({ chainId });
      default:
        return getVTreasuryV8ContractAddress({ chainId });
    }
  }, [chainId]);

  const { data: getPoolsData, isLoading: isGetPoolsDataLoading } = useGetIsolatedPools({
    accountAddress,
  });

  const vTokenAddresses = useMemo(
    () =>
      (getPoolsData?.pools || [])
        .filter(
          pool =>
            !areAddressesEqual(pool.comptrollerAddress, corePoolComptrollerContractAddress) &&
            (!lidoPoolComptrollerContractAddress ||
              !areAddressesEqual(pool.comptrollerAddress, lidoPoolComptrollerContractAddress)),
        )
        .reduce(
          (acc, pool) => acc.concat(pool.assets.map(asset => asset.vToken.address)),
          [] as string[],
        ),
    [getPoolsData?.pools, corePoolComptrollerContractAddress, lidoPoolComptrollerContractAddress],
  );

  const {
    data: vTokenBalancesTreasury = { balances: [] },
    isLoading: isGetVTokenBalancesTreasuryLoading,
  } = useGetVTokenBalancesAll(
    {
      account: treasuryAddress || '',
      vTokenAddresses,
    },
    {
      placeholderData: { balances: [] },
      enabled: !!treasuryAddress,
    },
  );

  const treasuryBalances = useMemo(
    () =>
      indexBy(
        (item: GetVTokenBalancesAllOutput['balances'][number]) => item.vToken.toLowerCase(), // index by vToken address
        vTokenBalancesTreasury.balances,
      ),
    [vTokenBalancesTreasury],
  );

  const {
    treasurySupplyBalanceCents,
    treasuryBorrowBalanceCents,
    treasuryBalanceCents,
    treasuryLiquidityBalanceCents,
  } = useMemo(() => {
    const data = (getPoolsData?.pools || []).reduce(
      (acc, pool) => {
        pool.assets.forEach(asset => {
          if (treasuryBalances?.[asset.vToken.address.toLowerCase()]) {
            const assetTreasuryBalanceMantissa = new BigNumber(
              treasuryBalances[asset.vToken.address.toLowerCase()].tokenBalance,
            );
            const assetTreasuryBalanceTokens = convertMantissaToTokens({
              value: assetTreasuryBalanceMantissa,
              token: asset.vToken.underlyingToken,
            });

            const assetTreasuryBalanceCents = assetTreasuryBalanceTokens
              .multipliedBy(asset.tokenPriceCents)
              .toNumber();

            acc.treasuryBalanceCents = acc.treasuryBalanceCents.plus(assetTreasuryBalanceCents);

            acc.treasurySupplyBalanceCents = acc.treasurySupplyBalanceCents.plus(
              asset.supplyBalanceCents,
            );
            acc.treasuryBorrowBalanceCents = acc.treasuryBorrowBalanceCents.plus(
              asset.borrowBalanceCents,
            );
            acc.treasuryLiquidityBalanceCents = acc.treasuryLiquidityBalanceCents.plus(
              asset.liquidityCents,
            );
          }
        });

        return acc;
      },
      {
        treasurySupplyBalanceCents: new BigNumber(0),
        treasuryBorrowBalanceCents: new BigNumber(0),
        treasuryBalanceCents: new BigNumber(0),
        treasuryLiquidityBalanceCents: new BigNumber(0),
      },
    );

    return data;
  }, [getPoolsData?.pools, treasuryBalances]);

  return {
    data: {
      treasurySupplyBalanceCents,
      treasuryBorrowBalanceCents,
      treasuryBalanceCents,
      treasuryLiquidityBalanceCents,
    },
    isLoading: isGetPoolsDataLoading || isGetVTokenBalancesTreasuryLoading,
  };
};

export default useGetIsolatedPoolsTreasuryTotals;
