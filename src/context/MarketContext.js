import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '../hooks/useRefresh';
import { fetchMarkets } from '../utilities/api';
import { indexBy } from '../utilities/common';
import useWeb3 from '../hooks/useWeb3';
import { useVaiUser } from '../hooks/useVaiUser';
import { useComptroller, useVenusLens } from '../hooks/useContract';

import * as constants from '../utilities/constants';

const MarketContext = React.createContext({
  markets: [],
  dailyVenus: 0,
  userMarketInfo: {},
  userTotalBorrowLimit: new BigNumber(0),
  userTotalBorrowBalance: new BigNumber(0),
  userXVSBalance: new BigNumber(0)
});

// This context provide a way for all the components to share the market data, thus avoid
// duplicated requests
const MarketContextProvider = ({ children }) => {
  const [markets, setMarkets] = useState([]);
  const [dailyVenus, setDailyVenus] = useState(0);
  const [userMarketInfo, setUserMarketInfo] = useState({});
  const [userTotalBorrowLimit, setUserTotalBorrowLimit] = useState(
    new BigNumber(0)
  );
  const [userTotalBorrowBalance, setUserTotalBorrowBalance] = useState(
    new BigNumber(0)
  );
  const [userXVSBalance, setUserXVSBalance] = useState(new BigNumber(0));
  const comptrollerContract = useComptroller();
  const lens = useVenusLens();
  const { account } = useWeb3React();
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

      const data = Object.keys(constants.CONTRACT_VBEP_ADDRESS)
        .map(item =>
          res.data.data.markets.find(
            market =>
              market.underlyingSymbol.toLowerCase() === item.toLowerCase()
          )
        )
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

    const getXvsBalance = balances => {
      const vxvs = constants.CONTRACT_VBEP_ADDRESS['xvs'].address.toLowerCase();
      const xvsDecimals = constants.CONTRACT_TOKEN_ADDRESS['xvs'].decimals;
      return new BigNumber(balances[vxvs].tokenBalance).shiftedBy(-xvsDecimals);
    }

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
            item => item.vToken.toLowerCase(),  // index by vToken address
            await lens.methods.vTokenBalancesAll(vtAddresses, account).call()
          );
          xvsBalance = getXvsBalance(balances);
        }

        const marketsMap = indexBy(
          item => item.underlyingSymbol.toLowerCase(),
          markets
        );

        let assetList = Object.values(constants.CONTRACT_TOKEN_ADDRESS).map(
          (item, index) => {
            const toDecimalAmount = mantissa => {
              return new BigNumber(mantissa).shiftedBy(-item.decimals);
            }

            // if no corresponding vassets, skip
            if (!constants.CONTRACT_VBEP_ADDRESS[item.id]) {
              return null;
            }

            let market = marketsMap[item.symbol.toLowerCase()];
            if (!market) {
              market = {};
            }

            const vtokenAddress = constants.CONTRACT_VBEP_ADDRESS[item.id].address.toLowerCase();
            const collateral = assetsIn
              .map(address => address.toLowerCase())
              .includes(vtokenAddress);

            let walletBalance = new BigNumber(0);
            let supplyBalance = new BigNumber(0);
            let borrowBalance = new BigNumber(0);
            let isEnabled = false;
            let percentOfLimit = new BigNumber(0);

            if (account) {
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
              collateralFactor: new BigNumber(
                market.collateralFactor || 0
              ).div(1e18),
              tokenPrice: new BigNumber(market.tokenPrice || 0),
              liquidity: new BigNumber(market.liquidity || 0),
              borrowCaps: new BigNumber(market.borrowCaps || 0),
              totalBorrows: new BigNumber(market.totalBorrows2 || 0),
              walletBalance,
              supplyBalance,
              borrowBalance,
              isEnabled,
              collateral,
              percentOfLimit
            };
          }
        )

        assetList = assetList.filter(item => !!item);

        // We use "hypothetical liquidity upon exiting a market" to disable the "exit market"
        // toggle. Sadly, the current VenusLens contract does not provide this info, so we
        // still have to query each market.
        assetList = await Promise.all(assetList.map(
          async asset => {
            const getHypotheticalLiquidity = () => {
              return comptrollerContract.methods
                .getHypotheticalAccountLiquidity(
                  account,
                  asset.vtokenAddress,
                  balances[asset.vtokenAddress.toLowerCase()].balanceOf,
                  0
                )
                .call()
            }
            return {
              ...asset,
              hypotheticalLiquidity: account ? await getHypotheticalLiquidity() : ['0', '0', '0']
            }
          }
        ));

        const totalBorrowBalance = assetList.reduce(
          (acc, asset) => {
            const borrowBalanceUSD = asset.borrowBalance.times(asset.tokenPrice);
            return acc.plus(borrowBalanceUSD);
          },
          new BigNumber(0)
        ).plus(userVaiMinted);

        const totalBorrowLimit = assetList.reduce(
          (acc, asset) => {
            if (asset.collateral) {
              const supplyBalanceUSD = asset.supplyBalance.times(asset.tokenPrice);
              return acc.plus(supplyBalanceUSD.times(asset.collateralFactor));
            }
            return acc;
          },
          new BigNumber(0)
        );

        // percent of limit
        assetList = assetList
          .map(item => {
            return {
              ...item,
              percentOfLimit: new BigNumber(totalBorrowLimit).isZero()
                ? '0'
                : item.borrowBalance
                    .times(item.tokenPrice)
                    .div(totalBorrowLimit)
                    .times(100)
                    .dp(0, 1)
                    .toString(10)
            };
          });

        if (!isMounted) {
          return;
        }

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
        userMarketInfo,
        userTotalBorrowLimit,
        userTotalBorrowBalance,
        userXVSBalance
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export { MarketContext, MarketContextProvider };
