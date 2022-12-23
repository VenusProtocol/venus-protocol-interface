import BigNumber from 'bignumber.js';
import config from 'config';
import { useContext, useMemo } from 'react';
import { indexBy } from 'utilities';

import {
  IGetVTokenBalancesAllOutput,
  useGetMainAssets,
  useGetVTokenBalancesAll,
} from 'clients/api';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { VBEP_TOKENS } from 'constants/tokens';
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
  treasuryTotalSupplyBalanceCents: BigNumber;
  treasuryTotalBorrowBalanceCents: BigNumber;
  treasuryTotalBalanceCents: BigNumber;
  treasuryTotalAvailableLiquidityBalanceCents: BigNumber;
}

export interface UseGetTreasuryTotalsOutput {
  isLoading: boolean;
  data: Data;
}

const vTokenAddresses = Object.values(VBEP_TOKENS).reduce(
  (acc, item) => (item.address ? [...acc, item.address] : acc),
  [] as string[],
);

const useGetTreasuryTotals = (): UseGetTreasuryTotalsOutput => {
  const { account } = useContext(AuthContext);

  const { data: getMainAssetsData, isLoading: isGetMainMarketsLoading } = useGetMainAssets({
    accountAddress: account?.address,
  });

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
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

  const treasuryBalances = useMemo(
    () =>
      indexBy(
        (item: IGetVTokenBalancesAllOutput['balances'][number]) => item.vToken.toLowerCase(), // index by vToken address
        vTokenBalancesTreasury.balances,
      ),
    [JSON.stringify(vTokenBalancesTreasury)],
  );

  const {
    treasuryTotalSupplyBalanceCents,
    treasuryTotalBorrowBalanceCents,
    treasuryTotalBalanceCents,
    treasuryTotalAvailableLiquidityBalanceCents,
  } = useMemo(() => {
    const data = (getMainAssetsData?.assets || []).reduce(
      (acc, asset) => {
        let treasuryBalanceTokens = new BigNumber(0);
        if (treasuryBalances && treasuryBalances[asset.vToken.address.toLowerCase()]) {
          const mantissa = treasuryBalances[asset.vToken.address.toLowerCase()].tokenBalance;
          treasuryBalanceTokens = new BigNumber(mantissa).shiftedBy(
            -asset.vToken.underlyingToken.decimals,
          );
        }

        acc.treasuryTotalBalanceCents = acc.treasuryTotalBalanceCents.plus(
          treasuryBalanceTokens.multipliedBy(asset.tokenPriceDollars).times(100),
        );

        acc.treasuryTotalSupplyBalanceCents = acc.treasuryTotalSupplyBalanceCents.plus(
          asset.supplyBalanceCents,
        );

        acc.treasuryTotalBorrowBalanceCents = acc.treasuryTotalBorrowBalanceCents.plus(
          asset.borrowBalanceCents,
        );

        acc.treasuryTotalAvailableLiquidityBalanceCents =
          acc.treasuryTotalAvailableLiquidityBalanceCents.plus(asset.liquidityCents);

        return acc;
      },
      {
        treasuryTotalSupplyBalanceCents: new BigNumber(0),
        treasuryTotalBorrowBalanceCents: new BigNumber(0),
        treasuryTotalBalanceCents: new BigNumber(0),
        treasuryTotalAvailableLiquidityBalanceCents: new BigNumber(0),
      },
    );

    return data;
  }, [treasuryBalances, getMainAssetsData?.assets]);

  return {
    data: {
      treasuryTotalSupplyBalanceCents,
      treasuryTotalBorrowBalanceCents,
      treasuryTotalBalanceCents,
      treasuryTotalAvailableLiquidityBalanceCents,
    },
    isLoading: isGetVTokenBalancesTreasuryLoading || isGetMainMarketsLoading,
  };
};

export default useGetTreasuryTotals;
