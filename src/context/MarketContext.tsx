import React, { useState, useEffect, useContext } from 'react';
import BigNumber from 'bignumber.js';

import { TREASURY_ADDRESS } from 'config';
import { useWeb3 } from 'clients/web3';
import { Asset, Market } from 'types';
import { VBEP_TOKENS, TOKENS } from 'constants/tokens';
import { getVBepToken, getToken, calculateCollateralValue } from 'utilities';
import { fetchMarkets } from 'utilities/api';
import { indexBy, notNull, convertCoinsToWei } from 'utilities/common';
import useRefresh from 'hooks/useRefresh';
import { useVaiUser } from 'hooks/useVaiUser';
import { useComptrollerContract, useVenusLensContract } from 'clients/contracts/hooks';
import { AuthContext } from './AuthContext';

const MarketContext = React.createContext({
  markets: [] as $TSFixMe[],
  dailyVenus: 0,
  treasuryTotalUSDBalance: new BigNumber(0),
  userMarketInfo: [] as Array<Asset>,
  userTotalBorrowLimit: new BigNumber(0),
  userTotalBorrowBalance: new BigNumber(0),
  userXvsBalance: new BigNumber(0),
});

// This context provide a way for all the components to share the market data, thus avoid
// duplicated requests

const MarketContextProvider = ({ children }: $TSFixMe) => {
  const [markets, setMarkets] = useState<$TSFixMe[]>([]);
  const [dailyVenus, setDailyVenus] = useState(0);
  const [userMarketInfo, setUserMarketInfo] = useState<Array<Asset>>([]);
  const [userTotalBorrowLimit, setUserTotalBorrowLimit] = useState(new BigNumber(0));
  const [userTotalBorrowBalance, setUserTotalBorrowBalance] = useState(new BigNumber(0));
  const [userXvsBalance, setUserXvsBalance] = useState(new BigNumber(0));
  const [treasuryTotalUSDBalance, setTreasuryTotalUSDBalance] = useState(new BigNumber(0));
  const comptrollerContract = useComptrollerContract();
  const lens = useVenusLensContract();
  const { account } = useContext(AuthContext);
  const web3 = useWeb3();
  const { userVaiMinted } = useVaiUser();

  const { fastRefresh } = useRefresh();

  useEffect(() => {
    let isMounted = true;
    const getMarkets = async () => {
      const res = await fetchMarkets();
      if (!res.data || !res.data.status) {
        return;
      }

      const data = Object.keys(VBEP_TOKENS)
        .map(item => {
          if (res && res.data && res.data.data) {
            return res.data.data.markets.find(
              (market: Market) => market.underlyingSymbol.toLowerCase() === item.toLowerCase(),
            );
          }
          return undefined;
        })
        .filter(item => !!item);

      if (!isMounted) {
        return;
      }

      setMarkets(data);
      setDailyVenus(res.data.data.dailyVenus);
    };
    getMarkets();
    return () => {
      isMounted = false;
    };
  }, [fastRefresh]);

  useEffect(() => {
    let isMounted = true;

    const getXvsBalance = (balances: $TSFixMe) => {
      const vxvs = getVBepToken('xvs').address.toLowerCase();
      const xvsDecimals = getToken('xvs').decimals;
      return new BigNumber(balances[vxvs].tokenBalance).shiftedBy(-xvsDecimals);
    };

    const updateMarketUserInfo = async () => {
      if (!markets) {
        return;
      }

      try {
        let xvsBalance = new BigNumber(0);
        const assetsIn = account
          ? await comptrollerContract.methods.getAssetsIn(account.address).call()
          : [];

        const vtAddresses = Object.values(VBEP_TOKENS)
          .filter(item => item.address)
          .map(item => item.address);

        let balances = {};
        if (account) {
          balances = indexBy(
            (item: $TSFixMe) => item.vToken.toLowerCase(), // index by vToken address
            await lens.methods.vTokenBalancesAll(vtAddresses, account.address).call(),
          );
          xvsBalance = getXvsBalance(balances);
        }

        // Fetch treasury balances
        const treasuryBalances = indexBy(
          (item: $TSFixMe) => item.vToken.toLowerCase(), // index by vToken address
          await lens.methods.vTokenBalancesAll(vtAddresses, TREASURY_ADDRESS).call(),
        );

        const marketsMap = indexBy(
          (item: $TSFixMe) => item.underlyingSymbol.toLowerCase(),
          markets,
        );

        const assetAndNullList = Object.values(TOKENS).map((item, index) => {
          const toDecimalAmount = (mantissa: string) =>
            new BigNumber(mantissa).shiftedBy(-item.decimals);

          // if no corresponding vassets, skip
          if (!getVBepToken(item.id)) {
            return null;
          }

          let market = marketsMap[item.symbol.toLowerCase()];
          if (!market) {
            market = {};
          }

          const vtokenAddress = getVBepToken(item.id).address.toLowerCase();

          const collateral = assetsIn
            .map((address: $TSFixMe) => address.toLowerCase())
            .includes(vtokenAddress);

          const treasuryBalance = toDecimalAmount(
            (treasuryBalances[vtokenAddress] as any).tokenBalance,
          );

          let walletBalance = new BigNumber(0);
          let supplyBalance = new BigNumber(0);
          let borrowBalance = new BigNumber(0);
          let isEnabled = false;
          const percentOfLimit = '0';

          if (account) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const wallet = balances[vtokenAddress];

            walletBalance = toDecimalAmount(wallet.tokenBalance);
            supplyBalance = toDecimalAmount(wallet.balanceOfUnderlying);
            borrowBalance = toDecimalAmount(wallet.borrowBalanceCurrent);
            if (item.id === 'bnb') {
              isEnabled = true;
            } else {
              isEnabled = toDecimalAmount(wallet.tokenAllowance).isGreaterThan(walletBalance);
            }
          }

          return {
            key: index,
            id: item.id,
            img: item.asset,
            vimg: item.vasset,
            symbol: market.underlyingSymbol || '',
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
        });

        let assetList = assetAndNullList.filter(notNull);

        // We use "hypothetical liquidity upon exiting a market" to disable the "exit market"
        // toggle. Sadly, the current VenusLens contract does not provide this info, so we
        // still have to query each market.
        assetList = await Promise.all(
          assetList.map(async asset => {
            const hypotheticalLiquidity: [string, string, string] = (
              account
                ? await comptrollerContract.methods
                    .getHypotheticalAccountLiquidity(
                      account.address,
                      asset.vtokenAddress,
                      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      balances[asset.vtokenAddress.toLowerCase()].balanceOf,
                      0,
                    )
                    .call()
                : ['0', '0', '0']
            ) as [string, string, string];

            return {
              ...asset,
              hypotheticalLiquidity,
            };
          }),
        );

        const totalBorrowBalance = assetList
          .reduce((acc, asset) => {
            const borrowBalanceUSD = asset.borrowBalance.times(asset.tokenPrice);
            return acc.plus(borrowBalanceUSD);
          }, new BigNumber(0))
          .plus(userVaiMinted);

        const totalBorrowLimit = assetList.reduce((acc, asset) => {
          if (asset.collateral) {
            return acc.plus(
              calculateCollateralValue({
                amountWei: convertCoinsToWei({ value: asset.supplyBalance, tokenId: asset.id }),
                asset,
              }),
            );
          }
          return acc;
        }, new BigNumber(0));

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
                .toString(10),
        }));

        if (!isMounted) {
          return;
        }

        // Calculate total treasury balance in USD
        const updatedTreasuryTotalUSDBalance = assetList.reduce((accumulator, asset) => {
          const treasuryUSDBalance = asset.treasuryBalance.multipliedBy(asset.tokenPrice);
          return accumulator.plus(treasuryUSDBalance);
        }, new BigNumber(0));

        setTreasuryTotalUSDBalance(updatedTreasuryTotalUSDBalance);
        setUserMarketInfo(assetList);
        setUserTotalBorrowLimit(totalBorrowLimit);
        setUserTotalBorrowBalance(totalBorrowBalance);
        setUserXvsBalance(xvsBalance);
      } catch (error) {
        console.log('error when get market data', error);
      }
    };
    updateMarketUserInfo();
    return () => {
      isMounted = false;
    };
  }, [markets, account, web3, fastRefresh]);

  return (
    <MarketContext.Provider
      value={{
        markets,
        dailyVenus,
        treasuryTotalUSDBalance,
        userMarketInfo,
        userTotalBorrowLimit,
        userTotalBorrowBalance,
        userXvsBalance,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export { MarketContext, MarketContextProvider };
