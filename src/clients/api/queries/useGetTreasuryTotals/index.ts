import BigNumber from 'bignumber.js';
import config from 'config';
import { useMemo } from 'react';
import { convertWeiToTokens, indexBy } from 'utilities';

import {
  GetVTokenBalancesAllOutput,
  useGetIsolatedPools,
  useGetVTokenBalancesAll,
} from 'clients/api';
import { useAuth } from 'context/AuthContext';

// Note: this is a temporary fix. Once we start refactoring this part we should
// probably fetch the treasury address using the Comptroller contract
const TREASURY_ADDRESSES = {
  56: '0xF322942f644A996A617BD29c16bd7d231d9F35E9',
  // When querying comptroller.treasuryAddress() we get an empty address back,
  // so for now I've let it as it is
  97: '0x0000000000000000000000000000000000000000',
};

export const treasuryAddress = TREASURY_ADDRESSES[config.chainId];

export interface Data {
  treasurySupplyBalanceCents: BigNumber;
  treasuryBorrowBalanceCents: BigNumber;
  treasuryBalanceCents: BigNumber;
  treasuryLiquidityBalanceCents: BigNumber;
}

export interface UseGetTreasuryTotalsOutput {
  isLoading: boolean;
  data: Data;
}

const useGetTreasuryTotals = (): UseGetTreasuryTotalsOutput => {
  const { accountAddress } = useAuth();

  const { data: getPoolsData, isLoading: isGetPoolsDataLoading } = useGetIsolatedPools({
    accountAddress,
  });

  const vTokenAddresses = useMemo(
    () =>
      (getPoolsData?.pools || []).reduce(
        (acc, pool) => acc.concat(pool.assets.map(asset => asset.vToken.address)),
        [] as string[],
      ),
    [getPoolsData?.pools],
  );

  const {
    data: vTokenBalancesTreasury = { balances: [] },
    isLoading: isGetVTokenBalancesTreasuryLoading,
  } = useGetVTokenBalancesAll(
    {
      account: treasuryAddress,
      vTokenAddresses,
    },
    {
      placeholderData: { balances: [] },
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
          if (treasuryBalances && treasuryBalances[asset.vToken.address.toLowerCase()]) {
            const assetTreasuryBalanceWei = new BigNumber(
              treasuryBalances[asset.vToken.address.toLowerCase()].tokenBalance,
            );
            const assetTreasuryBalanceTokens = convertWeiToTokens({
              valueWei: assetTreasuryBalanceWei,
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

export default useGetTreasuryTotals;
