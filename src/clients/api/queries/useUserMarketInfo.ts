import { UseQueryResult } from 'react-query';
import BigNumber from 'bignumber.js';
import { GetMarketsOutput } from 'clients/api/queries/getMarkets';
import { TREASURY_ADDRESS } from 'config';
import { useVaiUser } from 'hooks/useVaiUser';
import { Asset, Market } from 'types';
import { indexBy, convertCoinsToWei } from 'utilities/common';
import { calculateCollateralValue, getVBepToken } from 'utilities';
import { VBEP_TOKENS, TOKENS } from 'constants/tokens';
import {
  useGetMarkets,
  useGetAssetsInAccount,
  useGetVTokenBalancesAll,
  useGetHypotheticalLiquidityQueries,
  IGetVTokenBalancesAllOutput,
} from 'clients/api';

const useUserMarketInfo = ({
  accountAddress,
}: {
  accountAddress?: string;
}): {
  assets: Asset[];
  userTotalBorrowLimit: BigNumber;
  userTotalBorrowBalance: BigNumber;
  userTotalSupplyBalance: BigNumber;
} => {
  const { userVaiMinted } = useVaiUser();

  const vtAddresses = Object.values(VBEP_TOKENS)
    .filter(item => item.address)
    .map(item => item.address);
  const { data: markets = [] } = useGetMarkets({ placeholderData: [] });
  const { data: assetsInAccount = [] } = useGetAssetsInAccount(
    { account: accountAddress },
    { placeholderData: [], enabled: Boolean(accountAddress) },
  );
  const { data: vTokenBalancesAccount = [] } = useGetVTokenBalancesAll(
    { account: accountAddress || '', vtAddresses },
    { placeholderData: [], enabled: Boolean(accountAddress) },
  );
  const { data: vTokenBalancesTreasury = [] } = useGetVTokenBalancesAll(
    { account: TREASURY_ADDRESS, vtAddresses },
    { placeholderData: [], enabled: Boolean(accountAddress) },
  );

  let balances: Record<string, IGetVTokenBalancesAllOutput[number]> = {};
  balances = indexBy(
    (item: IGetVTokenBalancesAllOutput[number]) => item.vToken.toLowerCase(), // index by vToken address
    vTokenBalancesAccount,
  );
  const treasuryBalances = indexBy(
    (item: IGetVTokenBalancesAllOutput[number]) => item.vToken.toLowerCase(), // index by vToken address
    vTokenBalancesTreasury,
  );
  const marketsMap = indexBy(
    (item: Market) => item.underlyingSymbol.toLowerCase(),
    markets as GetMarketsOutput,
  );

  let assetList = Object.values(TOKENS).reduce((acc, item, index) => {
    const toDecimalAmount = (mantissa: string) => new BigNumber(mantissa).shiftedBy(-item.decimals);
    // if no corresponding vassets, skip
    if (!getVBepToken(item.id)) {
      return acc;
    }

    const market = marketsMap[item.symbol.toLowerCase()] || {};
    const vtokenAddress = getVBepToken(item.id).address.toLowerCase();
    const collateral = assetsInAccount
      .map((address: string) => address.toLowerCase())
      .includes(vtokenAddress);
    let treasuryBalance = new BigNumber(0);
    if (treasuryBalances[vtokenAddress]) {
      treasuryBalance = toDecimalAmount(treasuryBalances[vtokenAddress].tokenBalance);
    }

    let walletBalance = new BigNumber(0);
    let supplyBalance = new BigNumber(0);
    let borrowBalance = new BigNumber(0);
    let isEnabled = false;
    const percentOfLimit = '0';

    const wallet = balances[vtokenAddress];
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
      symbol: market.underlyingSymbol || item.id.toUpperCase(),
      decimals: item.decimals,
      tokenAddress: market.underlyingAddress,
      vsymbol: market.symbol,
      vtokenAddress,
      supplyApy: new BigNumber(market.supplyApy || 0),
      borrowApy: new BigNumber(market.borrowApy || 0),
      xvsSupplyApy: new BigNumber(market.supplyVenusApy || 0),
      xvsBorrowApy: new BigNumber(market.borrowVenusApy || 0),
      collateralFactor: new BigNumber(market.collateralFactor || 0).div(1e18),
      tokenPrice: new BigNumber(market.tokenPrice || 0),
      liquidity: new BigNumber(market.liquidity || 0),
      borrowCaps: new BigNumber(market.borrowCaps || 0),
      totalBorrows: new BigNumber(market.totalBorrows2 || 0),
      treasuryBalance,
      walletBalance,
      supplyBalance,
      borrowBalance,
      isEnabled,
      collateral,
      percentOfLimit,
      hypotheticalLiquidity: ['0', '0', '0'] as [string, string, string],
    };
    return [...acc, asset];
  }, []);

  // We use "hypothetical liquidity upon exiting a market" to disable the "exit market"
  // toggle. Sadly, the current VenusLens contract does not provide this info, so we
  // still have to query each market.
  const hypotheticalLiquidityQueries = useGetHypotheticalLiquidityQueries(
    { assetList, account: accountAddress, balances },
    { enabled: Boolean(accountAddress) },
  );
  assetList = (hypotheticalLiquidityQueries as Array<UseQueryResult<Asset>>).reduce(
    (acc: Asset[], result: UseQueryResult<Asset>, idx: number) => {
      const assetCopy = { ...assetList[idx] };
      if (result.data) {
        assetCopy.hypotheticalLiquidity = result.data;
      }
      acc.push(assetCopy);
      return acc;
    },
    [],
  );

  const { totalBorrowBalance, totalBorrowLimit, totalSupplyBalance } = assetList.reduce(
    (
      acc: {
        totalBorrowBalance: BigNumber;
        totalBorrowLimit: BigNumber;
        totalSupplyBalance: BigNumber;
      },
      asset: Asset,
    ) => {
      const borrowBalanceUSD = asset.borrowBalance.times(asset.tokenPrice);
      const supplyBalanceUSD = asset.supplyBalance.times(asset.tokenPrice);
      acc.totalBorrowBalance = acc.totalBorrowBalance.plus(borrowBalanceUSD);
      acc.totalSupplyBalance = acc.totalSupplyBalance.plus(supplyBalanceUSD);
      if (asset.collateral) {
        acc.totalBorrowLimit = acc.totalBorrowLimit.plus(
          calculateCollateralValue({
            amountWei: convertCoinsToWei({ value: asset.supplyBalance, tokenId: asset.id }),
            asset,
          }),
        );
      }
      return acc;
    },
    {
      totalBorrowBalance: new BigNumber(0),
      totalBorrowLimit: new BigNumber(0),
      totalSupplyBalance: new BigNumber(0),
    },
  );
  const userTotalBorrowBalance = totalBorrowBalance.plus(userVaiMinted);

  // percent of limit
  assetList = assetList.map((item: Asset) => ({
    ...item,
    percentOfLimit: new BigNumber(totalBorrowLimit).isZero()
      ? '0'
      : item.borrowBalance
          .times(item.tokenPrice)
          .div(totalBorrowLimit)
          .times(100)
          .dp(0, 1)
          .toFixed(),
  }));
  return {
    assets: assetList,
    userTotalBorrowLimit: totalBorrowLimit,
    userTotalBorrowBalance,
    userTotalSupplyBalance: totalSupplyBalance,
  };
};

export default useUserMarketInfo;
