import BigNumber from 'bignumber.js';
import config from 'config';
import { useContext, useMemo } from 'react';
import { convertWeiToTokens, indexBy } from 'utilities';

import { IGetVTokenBalancesAllOutput, useGetPools, useGetVTokenBalancesAll } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

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
  treasurySupplyBalanceCents: number;
  treasuryBorrowBalanceCents: number;
  treasuryBalanceCents: number;
  treasuryLiquidityBalanceCents: number;
}

export interface UseGetTreasuryTotalsOutput {
  isLoading: boolean;
  data: Data;
}

const useGetTreasuryTotals = (): UseGetTreasuryTotalsOutput => {
  const { account } = useContext(AuthContext);

  const { data: getPoolsData, isLoading: isGetPoolsDataLoading } = useGetPools({
    accountAddress: account?.address,
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
        (item: IGetVTokenBalancesAllOutput['balances'][number]) => item.vToken.toLowerCase(), // index by vToken address
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
              .multipliedBy(asset.tokenPriceDollars)
              // Convert to cents
              .times(100)
              .dp(0)
              .toNumber();

            acc.treasuryBalanceCents += assetTreasuryBalanceCents;

            acc.treasurySupplyBalanceCents += asset.supplyBalanceCents;
            acc.treasuryBorrowBalanceCents += asset.borrowBalanceCents;
            acc.treasuryLiquidityBalanceCents += asset.liquidityCents;
          }
        });

        return acc;
      },
      {
        treasurySupplyBalanceCents: 0,
        treasuryBorrowBalanceCents: 0,
        treasuryBalanceCents: 0,
        treasuryLiquidityBalanceCents: 0,
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
