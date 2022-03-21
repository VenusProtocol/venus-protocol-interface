import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';

import { TREASURY_ADDRESS } from 'config';
import { useWeb3, useWeb3Account } from 'clients/web3';
import useRefresh from '../hooks/useRefresh';
import { fetchMarkets } from '../utilities/api';
import { indexBy } from '../utilities/common';
import { useVaiUser } from '../hooks/useVaiUser';
import { useComptroller, useVenusLens } from '../hooks/useContract';
import * as constants from '../utilities/constants';

const MarketContext = React.createContext({
  markets: [] as $TSFixMe[],
  dailyVenus: 0,
  treasuryTotalUSDBalance: new BigNumber(0),
  userMarketInfo: {},
  userTotalBorrowLimit: new BigNumber(0),
  userTotalBorrowBalance: new BigNumber(0),
  userXVSBalance: new BigNumber(0),
});

// This context provide a way for all the components to share the market data, thus avoid
// duplicated requests

const MarketContextProvider = ({ children }: $TSFixMe) => {
  const [markets, setMarkets] = useState<$TSFixMe[]>([]);
  const [dailyVenus, setDailyVenus] = useState(0);
  const [userMarketInfo, setUserMarketInfo] = useState({});
  const [userTotalBorrowLimit, setUserTotalBorrowLimit] = useState(new BigNumber(0));
  const [userTotalBorrowBalance, setUserTotalBorrowBalance] = useState(new BigNumber(0));
  const [userXVSBalance, setUserXVSBalance] = useState(new BigNumber(0));
  const [treasuryTotalUSDBalance, setTreasuryTotalUSDBalance] = useState(new BigNumber(0));
  const comptrollerContract = useComptroller();
  const lens = useVenusLens();
  const { account } = useWeb3Account();
  const web3 = useWeb3();
  const { userVaiMinted } = useVaiUser();

  const { fastRefresh } = useRefresh();

  useEffect(() => {
    let isMounted = true;
    const getMarkets = async () => {
      const res = await fetchMarkets();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type '{ status: ... Remove this comment to see the full error message
      if (!res.data || !res.data.status) {
        return;
      }

      const data = Object.keys(constants.CONTRACT_VBEP_ADDRESS)
        .map(item =>
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type '{ status: ... Remove this comment to see the full error message
          res.data.data.markets.find(
            (market: $TSFixMe) => market.underlyingSymbol.toLowerCase() === item.toLowerCase(),
          ),
        )
        .filter(item => !!item);

      if (!isMounted) {
        return;
      }

      setMarkets(data);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type '{ status: ... Remove this comment to see the full error message
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
      const vxvs = constants.CONTRACT_VBEP_ADDRESS.xvs.address.toLowerCase();
      const xvsDecimals = constants.CONTRACT_TOKEN_ADDRESS.xvs.decimals;
      return new BigNumber(balances[vxvs].tokenBalance).shiftedBy(-xvsDecimals);
    };

    const updateMarketUserInfo = async () => {
      if (!markets) {
        return;
      }

      try {
        let xvsBalance = new BigNumber(0);
        const assetsIn = account
          ? await comptrollerContract.methods.getAssetsIn(account).call()
          : [];

        const vtAddresses = Object.values(constants.CONTRACT_VBEP_ADDRESS)
          .filter(item => item.address)
          .map(item => item.address);

        let balances = {};
        if (account) {
          balances = indexBy(
            (item: $TSFixMe) => item.vToken.toLowerCase(), // index by vToken address
            await lens.methods.vTokenBalancesAll(vtAddresses, account).call(),
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

        let assetList = Object.values(constants.CONTRACT_TOKEN_ADDRESS).map((item, index) => {
          const toDecimalAmount = (mantissa: $TSFixMe) =>
            new BigNumber(mantissa).shiftedBy(-item.decimals);

          // if no corresponding vassets, skip
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          if (!constants.CONTRACT_VBEP_ADDRESS[item.id]) {
            return null;
          }

          let market = marketsMap[item.symbol.toLowerCase()];
          if (!market) {
            market = {};
          }

          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          const vtokenAddress = constants.CONTRACT_VBEP_ADDRESS[item.id].address.toLowerCase();
          const collateral = assetsIn
            .map((address: $TSFixMe) => address.toLowerCase())
            .includes(vtokenAddress);

          const treasuryBalance = toDecimalAmount(treasuryBalances[vtokenAddress].tokenBalance);

          let walletBalance = new BigNumber(0);
          let supplyBalance = new BigNumber(0);
          let borrowBalance = new BigNumber(0);
          let isEnabled = false;
          const percentOfLimit = new BigNumber(0);

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
            name: market.underlyingSymbol || '',
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
          };
        });

        assetList = assetList.filter(item => !!item);

        // We use "hypothetical liquidity upon exiting a market" to disable the "exit market"
        // toggle. Sadly, the current VenusLens contract does not provide this info, so we
        // still have to query each market.
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ hypotheticalLiquidity: any; key?: number |... Remove this comment to see the full error message
        assetList = await Promise.all(
          assetList.map(async asset => {
            const getHypotheticalLiquidity = () =>
              comptrollerContract.methods
                .getHypotheticalAccountLiquidity(
                  account,
                  // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                  asset.vtokenAddress,
                  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  balances[asset.vtokenAddress.toLowerCase()].balanceOf,
                  0,
                )
                .call();
            return {
              ...asset,
              hypotheticalLiquidity: account ? await getHypotheticalLiquidity() : ['0', '0', '0'],
            };
          }),
        );

        const totalBorrowBalance = assetList
          .reduce((acc, asset) => {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            const borrowBalanceUSD = asset.borrowBalance.times(
              // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
              asset.tokenPrice,
            );
            return acc.plus(borrowBalanceUSD);
          }, new BigNumber(0))
          .plus(userVaiMinted);

        const totalBorrowLimit = assetList.reduce((acc, asset) => {
          // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
          if (asset.collateral) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            const supplyBalanceUSD = asset.supplyBalance.times(
              // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
              asset.tokenPrice,
            );
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            return acc.plus(supplyBalanceUSD.times(asset.collateralFactor));
          }
          return acc;
        }, new BigNumber(0));

        // percent of limit
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ percentOfLimit: string; key?: number | und... Remove this comment to see the full error message
        assetList = assetList.map(item => ({
          ...item,
          percentOfLimit: new BigNumber(totalBorrowLimit).isZero()
            ? '0'
            : // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
              item.borrowBalance
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
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
          // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
          const treasuryUSDBalance = asset.treasuryBalance.multipliedBy(asset.tokenPrice);
          return accumulator.plus(treasuryUSDBalance);
        }, new BigNumber(0));

        setTreasuryTotalUSDBalance(updatedTreasuryTotalUSDBalance);
        setUserMarketInfo(assetList);
        setUserTotalBorrowLimit(totalBorrowLimit);
        setUserTotalBorrowBalance(totalBorrowBalance);
        setUserXVSBalance(xvsBalance);
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
        userXVSBalance,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export { MarketContext, MarketContextProvider };
