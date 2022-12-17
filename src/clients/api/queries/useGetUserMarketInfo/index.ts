import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset } from 'types';
import {
  calculateCollateralValue,
  convertTokensToWei,
  convertWeiToTokens,
  getVTokenByAddress,
  indexBy,
} from 'utilities';

import {
  IGetVTokenBalancesAllOutput,
  useGetAssetsInAccount,
  useGetMarkets,
  useGetMintedVai,
  useGetVTokenBalancesAll,
} from 'clients/api';
import { TOKENS, VBEP_TOKENS } from 'constants/tokens';

export interface Data {
  assets: Asset[];
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
  totalXvsDistributedWei: BigNumber;
  dailyVenusWei: BigNumber;
}

export interface UseGetUserMarketInfoOutput {
  isLoading: boolean;
  data: Data;
}

const vTokenAddresses = Object.values(VBEP_TOKENS).reduce(
  (acc, item) => (item.address ? [...acc, item.address] : acc),
  [] as string[],
);

// TODO: refactor to merge with useGetMarkets
const useGetUserMarketInfo = ({
  accountAddress,
}: {
  accountAddress?: string;
}): UseGetUserMarketInfoOutput => {
  const { data: userMintedVaiData, isLoading: isGetUserMintedVaiLoading } = useGetMintedVai(
    {
      accountAddress: accountAddress || '',
    },
    {
      enabled: !!accountAddress,
    },
  );

  const {
    data: getMarketsData = {
      markets: [],
      dailyVenusWei: new BigNumber(0),
    },
    isLoading: isGetMarketsLoading,
  } = useGetMarkets({
    placeholderData: {
      markets: [],
      dailyVenusWei: new BigNumber(0),
    },
  });

  const {
    data: assetsInAccount = {
      tokenAddresses: [],
    },
    isLoading: isGetAssetsInAccountLoading,
  } = useGetAssetsInAccount(
    { accountAddress: accountAddress || '' },
    {
      enabled: !!accountAddress,
      placeholderData: {
        tokenAddresses: [],
      },
    },
  );

  const {
    data: vTokenBalancesAccount = { balances: [] },
    isLoading: isGetVTokenBalancesAccountLoading,
  } = useGetVTokenBalancesAll(
    { account: accountAddress || '', vTokenAddresses },
    { enabled: !!accountAddress, placeholderData: { balances: [] } },
  );

  const vTokenBalances = useMemo(
    () =>
      indexBy(
        (item: IGetVTokenBalancesAllOutput['balances'][number]) => item.vToken.toLowerCase(), // index by vToken address
        vTokenBalancesAccount.balances,
      ),
    [JSON.stringify(vTokenBalancesAccount)],
  );

  const isLoading =
    isGetMarketsLoading ||
    isGetAssetsInAccountLoading ||
    isGetVTokenBalancesAccountLoading ||
    isGetUserMintedVaiLoading;

  const data = useMemo(() => {
    const {
      assets,
      userTotalBorrowBalanceCents,
      userTotalBorrowLimitCents,
      userTotalSupplyBalanceCents,
      totalXvsDistributedWei,
    } = (getMarketsData?.markets || []).reduce(
      (acc, market) => {
        const vToken = getVTokenByAddress(market.address);

        // Skip token if it isn't listed
        if (!vToken) {
          return acc;
        }

        const vTokenAddress = vToken.address.toLowerCase();
        const collateral = (assetsInAccount.tokenAddresses || [])
          .map((address: string) => address.toLowerCase())
          .includes(vTokenAddress);

        let walletBalance = new BigNumber(0);
        let userSupplyBalanceTokens = new BigNumber(0);
        let userBorrowBalanceTokens = new BigNumber(0);
        const percentOfLimit = '0';

        const wallet = vTokenBalances && vTokenBalances[vTokenAddress];
        if (accountAddress && wallet) {
          const toDecimalAmount = (mantissa: string) =>
            new BigNumber(mantissa).shiftedBy(-vToken.underlyingToken.decimals);

          walletBalance = toDecimalAmount(wallet.tokenBalance);
          userSupplyBalanceTokens = toDecimalAmount(wallet.balanceOfUnderlying);
          userBorrowBalanceTokens = toDecimalAmount(wallet.borrowBalanceCurrent);
        }

        const reserveTokens = market?.totalReserves
          ? convertWeiToTokens({
              valueWei: new BigNumber(market.totalReserves),
              token: vToken.underlyingToken,
            })
          : new BigNumber(0);

        const exchangeRateVTokens = market?.exchangeRate
          ? new BigNumber(1).div(
              new BigNumber(market.exchangeRate).div(
                new BigNumber(10).pow(18 + vToken.underlyingToken.decimals - vToken.decimals),
              ),
            )
          : new BigNumber(0);

        const asset = {
          vToken,
          supplyApyPercentage: new BigNumber(market?.supplyApy || 0),
          borrowApyPercentage: new BigNumber(market?.borrowApy || 0),
          xvsSupplyApr: new BigNumber(market?.supplyVenusApr || 0),
          xvsSupplyApy: new BigNumber(market?.supplyVenusApy || 0),
          xvsBorrowApr: new BigNumber(market?.borrowVenusApr || 0),
          xvsBorrowApy: new BigNumber(market?.borrowVenusApy || 0),
          collateralFactor: new BigNumber(market?.collateralFactor || 0).div(1e18).toNumber(),
          reserveTokens,
          reserveFactor: new BigNumber(market?.reserveFactor || 0).div(1e18).toNumber(),
          exchangeRateVTokens,
          supplierCount: market?.supplierCount || 0,
          borrowerCount: market?.borrowerCount || 0,
          tokenPriceDollars: new BigNumber(market?.tokenPrice || 0),
          liquidityCents: new BigNumber(market?.liquidity || 0).multipliedBy(100).dp(0).toNumber(),
          userSupplyBalanceTokens,
          userBorrowBalanceTokens,
          borrowCapTokens: new BigNumber(market?.borrowCaps || 0),
          borrowBalanceCents: new BigNumber(market?.totalBorrowsUsd || 0).times(100).dp(0).toNumber(),
          supplyBalanceCents: new BigNumber(market?.totalSupplyUsd || 0).times(100).dp(0).toNumber(),
          supplyBalanceTokens: new BigNumber(market?.totalSupply2 || 0),
          borrowBalanceTokens: new BigNumber(market?.totalBorrows2 || 0),
          walletBalance,
          collateral,
          percentOfLimit,
          xvsPerDay: new BigNumber(market?.supplierDailyVenus || 0)
            .plus(new BigNumber(market?.borrowerDailyVenus || 0))
            .div(new BigNumber(10).pow(TOKENS.xvs.decimals)),
        };

        // user totals
        const borrowBalanceCents = asset.userBorrowBalanceTokens
          .times(asset.tokenPriceDollars)
          .times(100);
        const supplyBalanceCents = asset.userSupplyBalanceTokens
          .times(asset.tokenPriceDollars)
          .times(100);
        acc.userTotalBorrowBalanceCents = acc.userTotalBorrowBalanceCents.plus(borrowBalanceCents);
        acc.userTotalSupplyBalanceCents = acc.userTotalSupplyBalanceCents.plus(supplyBalanceCents);

        acc.totalXvsDistributedWei = acc.totalXvsDistributedWei.plus(
          new BigNumber(market?.totalDistributed || 0).times(
            new BigNumber(10).pow(TOKENS.xvs.decimals),
          ),
        );

        // Create borrow limit based on assets supplied as collateral
        if (asset.collateral) {
          acc.userTotalBorrowLimitCents = acc.userTotalBorrowLimitCents.plus(
            calculateCollateralValue({
              amountWei: convertTokensToWei({
                value: asset.userSupplyBalanceTokens,
                token: vToken.underlyingToken,
              }),
              token: asset.vToken.underlyingToken,
              tokenPriceDollars: asset.tokenPriceDollars,
              collateralFactor: asset.collateralFactor,
            }).times(100),
          );
        }

        return { ...acc, assets: [...acc.assets, asset] };
      },
      {
        assets: [] as Asset[],
        userTotalBorrowBalanceCents: new BigNumber(0),
        userTotalBorrowLimitCents: new BigNumber(0),
        userTotalSupplyBalanceCents: new BigNumber(0),
        totalXvsDistributedWei: new BigNumber(0),
      },
    );

    let assetList = assets;

    const userTotalBorrowBalanceWithUserMintedVai = userTotalBorrowBalanceCents.plus(
      userMintedVaiData
        ? convertWeiToTokens({
            valueWei: userMintedVaiData.mintedVaiWei,
            token: TOKENS.vai,
          })
            // Convert VAI to dollar cents (we assume 1 VAI = 1 dollar)
            .times(100)
        : 0,
    );

    // percent of limit
    assetList = assetList.map((item: Asset) => ({
      ...item,
      percentOfLimit: new BigNumber(userTotalBorrowLimitCents).isZero()
        ? '0'
        : item.userBorrowBalanceTokens
            .times(item.tokenPriceDollars)
            .div(userTotalBorrowLimitCents)
            .times(100)
            .dp(0, 1)
            .toFixed(),
    }));

    return {
      assets: assetList,
      userTotalBorrowBalanceCents: userTotalBorrowBalanceWithUserMintedVai,
      userTotalBorrowLimitCents,
      userTotalSupplyBalanceCents,
      dailyVenusWei: getMarketsData.dailyVenusWei || new BigNumber(0),
      totalXvsDistributedWei,
    };
  }, [
    userMintedVaiData?.mintedVaiWei.toFixed(),
    JSON.stringify(getMarketsData?.markets),
    JSON.stringify(assetsInAccount),
    JSON.stringify(vTokenBalances),
    JSON.stringify(getMarketsData),
  ]);

  return {
    isLoading,
    data,
    // TODO: handle errors and retry scenarios
  };
};

export default useGetUserMarketInfo;
