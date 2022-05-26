import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { IGetMarketsOutput } from 'clients/api/queries/getMarkets';
import { TREASURY_ADDRESS } from 'config';
import { useVaiUser } from 'hooks/useVaiUser';
import { Asset, Market } from 'types';
import { indexBy, convertCoinsToWei } from 'utilities/common';
import { calculateCollateralValue, getVBepToken, getToken } from 'utilities';
import { VBEP_TOKENS, TOKENS } from 'constants/tokens';
import {
  useGetMarkets,
  useGetAssetsInAccount,
  useGetVTokenBalancesAll,
  IGetVTokenBalancesAllOutput,
} from 'clients/api';

export interface IData {
  assets: Asset[];
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
  treasuryTotalSupplyUsdBalanceCents: BigNumber;
  treasuryTotalAvailableLiquidityUsdBalanceCents: BigNumber;
  treasuryTotalBorrowUsdBalanceCents: BigNumber;
  treasuryTotalUsdBalanceCents: BigNumber;
  totalXvsDistributedWei: BigNumber;
  dailyVenus: BigNumber;
}

export interface UseGetUserMarketInfoOutput {
  isLoading: boolean;
  data: IData;
}

const vTokenAddresses: string[] = Object.values(VBEP_TOKENS).reduce(
  (acc, item) => (item.address ? [...acc, item.address] : acc),
  [],
);

// TODO: decouple, this hook handles too many things
const useGetUserMarketInfo = ({
  accountAddress,
}: {
  accountAddress?: string;
}): UseGetUserMarketInfoOutput => {
  const { userVaiMinted } = useVaiUser();

  const {
    data: getMarketsData = {
      markets: [],
      dailyVenus: new BigNumber(0),
    },
    isLoading: isGetMarketsLoading,
  } = useGetMarkets({
    placeholderData: {
      markets: [],
      dailyVenus: new BigNumber(0),
    },
  });

  const marketsMap = useMemo(
    () =>
      indexBy(
        (item: Market) => item.underlyingSymbol.toLowerCase(), // index by symbol of underlying token
        getMarketsData.markets as IGetMarketsOutput['markets'],
      ),
    [getMarketsData?.markets],
  );

  const { data: assetsInAccount = [], isLoading: isGetAssetsInAccountLoading } =
    useGetAssetsInAccount(
      { account: accountAddress },
      { enabled: !!accountAddress, placeholderData: [] },
    );

  const { data: vTokenBalancesAccount = [], isLoading: isGetVTokenBalancesAccountLoading } =
    useGetVTokenBalancesAll(
      { account: accountAddress || '', vTokenAddresses },
      { enabled: !!accountAddress, placeholderData: [] },
    );

  const vTokenBalances = useMemo(
    () =>
      indexBy(
        (item: IGetVTokenBalancesAllOutput[number]) => item.vToken.toLowerCase(), // index by vToken address
        vTokenBalancesAccount,
      ),
    [JSON.stringify(vTokenBalancesAccount)],
  );

  const { data: vTokenBalancesTreasury = [], isLoading: isGetVTokenBalancesTreasuryLoading } =
    useGetVTokenBalancesAll(
      {
        account: TREASURY_ADDRESS,
        vTokenAddresses,
      },
      {
        placeholderData: [],
      },
    );

  const treasuryBalances = useMemo(
    () =>
      indexBy(
        (item: IGetVTokenBalancesAllOutput[number]) => item.vToken.toLowerCase(), // index by vToken address
        vTokenBalancesTreasury,
      ),
    [JSON.stringify(vTokenBalancesTreasury)],
  );

  const isLoading =
    isGetMarketsLoading ||
    isGetAssetsInAccountLoading ||
    isGetVTokenBalancesAccountLoading ||
    isGetVTokenBalancesTreasuryLoading;

  const data = useMemo(() => {
    const {
      assets,
      userTotalBorrowBalanceCents,
      userTotalBorrowLimitCents,
      userTotalSupplyBalanceCents,
      treasuryTotalUsdBalanceCents,
      treasuryTotalSupplyUsdBalanceCents,
      treasuryTotalBorrowUsdBalanceCents,
      treasuryTotalAvailableLiquidityUsdBalanceCents,
      totalXvsDistributedWei,
    } = Object.values(TOKENS).reduce(
      (acc, item, index) => {
        const { assets: assetAcc } = acc;

        const toDecimalAmount = (mantissa: string) =>
          new BigNumber(mantissa).shiftedBy(-item.decimals);

        const vBepToken = getVBepToken(item.id);
        // if no corresponding vassets, skip
        if (!vBepToken) {
          return acc;
        }

        const market = marketsMap[item.id];
        const vtokenAddress = vBepToken.address.toLowerCase();
        const collateral = (assetsInAccount || [])
          .map((address: string) => address.toLowerCase())
          .includes(vtokenAddress);

        let treasuryBalance = new BigNumber(0);
        if (treasuryBalances && treasuryBalances[vtokenAddress]) {
          treasuryBalance = toDecimalAmount(treasuryBalances[vtokenAddress].tokenBalance);
        }

        let walletBalance = new BigNumber(0);
        let supplyBalance = new BigNumber(0);
        let borrowBalance = new BigNumber(0);
        let isEnabled = false;
        const percentOfLimit = '0';

        const wallet = vTokenBalances && vTokenBalances[vtokenAddress];
        if (accountAddress && wallet) {
          walletBalance = toDecimalAmount(wallet.tokenBalance);
          supplyBalance = toDecimalAmount(wallet.balanceOfUnderlying);
          borrowBalance = toDecimalAmount(wallet.borrowBalanceCurrent);
          if (item.id === 'bnb') {
            isEnabled = true;
          } else {
            isEnabled = toDecimalAmount(wallet.tokenAllowance).isGreaterThan(walletBalance);
          }
        }

        const asset = {
          key: index,
          id: item.id,
          img: item.asset,
          vimg: item.vasset,
          symbol: market?.underlyingSymbol || item.id.toUpperCase(),
          decimals: item.decimals,
          tokenAddress: market?.underlyingAddress,
          vsymbol: market?.symbol,
          vtokenAddress,
          supplyApy: new BigNumber(market?.supplyApy || 0),
          borrowApy: new BigNumber(market?.borrowApy || 0),
          xvsSupplyApy: new BigNumber(market?.supplyVenusApy || 0),
          xvsBorrowApy: new BigNumber(market?.borrowVenusApy || 0),
          collateralFactor: new BigNumber(market?.collateralFactor || 0).div(1e18),
          tokenPrice: new BigNumber(market?.tokenPrice || 0),
          liquidity: new BigNumber(market?.liquidity || 0),
          borrowCaps: new BigNumber(market?.borrowCaps || 0),
          treasuryTotalBorrowsUsdCents: new BigNumber(market?.totalBorrowsUsd || 0).times(100),
          treasuryTotalSupplyUsdCents: new BigNumber(market?.totalSupplyUsd || 0).times(100),
          treasuryTotalSupply: new BigNumber(market?.totalSupply || 0),
          treasuryTotalBorrows: new BigNumber(market?.totalBorrows2 || 0),
          treasuryBalance,
          walletBalance,
          supplyBalance,
          borrowBalance,
          isEnabled,
          collateral,
          percentOfLimit,
          xvsPerDay: new BigNumber(market?.supplierDailyVenus || 0)
            .plus(new BigNumber(market?.borrowerDailyVenus || 0))
            .div(new BigNumber(10).pow(getToken('xvs').decimals)),
        };

        // user totals
        const borrowBalanceUsdCents = asset.borrowBalance.times(asset.tokenPrice).times(100);
        const supplyBalanceUsdCents = asset.supplyBalance.times(asset.tokenPrice).times(100);
        acc.userTotalBorrowBalanceCents =
          acc.userTotalBorrowBalanceCents.plus(borrowBalanceUsdCents);
        acc.userTotalSupplyBalanceCents =
          acc.userTotalSupplyBalanceCents.plus(supplyBalanceUsdCents);

        // treasury totals
        acc.treasuryTotalUsdBalanceCents = acc.treasuryTotalUsdBalanceCents.plus(
          asset.treasuryBalance.multipliedBy(asset.tokenPrice).times(100),
        );
        acc.treasuryTotalSupplyUsdBalanceCents = acc.treasuryTotalSupplyUsdBalanceCents.plus(
          asset.treasuryTotalSupplyUsdCents,
        );
        acc.treasuryTotalBorrowUsdBalanceCents = acc.treasuryTotalBorrowUsdBalanceCents.plus(
          asset.treasuryTotalBorrowsUsdCents,
        );
        acc.treasuryTotalAvailableLiquidityUsdBalanceCents =
          acc.treasuryTotalAvailableLiquidityUsdBalanceCents.plus(asset.liquidity.times(100));
        // total distributed Xvs
        acc.totalXvsDistributedWei = acc.totalXvsDistributedWei.plus(
          new BigNumber(market?.totalDistributed || 0).times(
            new BigNumber(10).pow(getToken('xvs').decimals),
          ),
        );

        // Create borrow limit based on assets supplied as collateral
        if (asset.collateral) {
          acc.userTotalBorrowLimitCents = acc.userTotalBorrowLimitCents.plus(
            calculateCollateralValue({
              amountWei: convertCoinsToWei({ value: asset.supplyBalance, tokenId: asset.id }),
              tokenId: asset.id,
              tokenPriceTokens: asset.tokenPrice,
              collateralFactor: asset.collateralFactor,
            }).times(100),
          );
        }

        return { ...acc, assets: [...assetAcc, asset] };
      },
      {
        assets: [],
        userTotalBorrowBalanceCents: new BigNumber(0),
        userTotalBorrowLimitCents: new BigNumber(0),
        userTotalSupplyBalanceCents: new BigNumber(0),
        treasuryTotalBorrowUsdBalanceCents: new BigNumber(0),
        treasuryTotalUsdBalanceCents: new BigNumber(0),
        treasuryTotalSupplyUsdBalanceCents: new BigNumber(0),
        treasuryTotalAvailableLiquidityUsdBalanceCents: new BigNumber(0),
        totalXvsDistributedWei: new BigNumber(0),
      },
    );

    let assetList = assets;

    const userTotalBorrowBalanceWithUserMintedVai = userTotalBorrowBalanceCents.plus(
      userVaiMinted.times(100),
    );

    // percent of limit
    assetList = assetList.map((item: Asset) => ({
      ...item,
      percentOfLimit: new BigNumber(userTotalBorrowLimitCents).isZero()
        ? '0'
        : item.borrowBalance
            .times(item.tokenPrice)
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
      treasuryTotalAvailableLiquidityUsdBalanceCents,
      treasuryTotalUsdBalanceCents,
      treasuryTotalBorrowUsdBalanceCents,
      treasuryTotalSupplyUsdBalanceCents,
      dailyVenus: getMarketsData.dailyVenus || new BigNumber(0),
      totalXvsDistributedWei,
    };
  }, [
    JSON.stringify(marketsMap),
    JSON.stringify(assetsInAccount),
    JSON.stringify(treasuryBalances),
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
