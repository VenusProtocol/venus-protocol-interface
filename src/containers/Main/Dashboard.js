/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import MainLayout from 'containers/Layout/MainLayout';
import CoinInfo from 'components/Dashboard/CoinInfo';
import VaiInfo from 'components/Dashboard/VaiInfo';
import BorrowLimit from 'components/Dashboard/BorrowLimit';
import Overview from 'components/Dashboard/Overview';
import WalletBalance from 'components/Dashboard/WalletBalance';
import Market from 'components/Dashboard/Market';
import { connectAccount, accountActionCreators } from 'core';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { Row, Column } from 'components/Basic/Style';
import {
  getTokenContract,
  getVbepContract,
  getComptrollerContract,
  getVaiControllerContract,
  getVaiTokenContract,
  methods
} from 'utilities/ContractService';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';

const DashboardWrapper = styled.div`
  height: 100%;
`;

const SpinnerWrapper = styled.div`
  height: 85vh;
  width: 100%;

  @media only screen and (max-width: 1440px) {
    height: 70vh;
  }
`;

function Dashboard({ settings, setSetting }) {
  const [isMarketInfoUpdating, setMarketInfoUpdating] = useState(false);

  const updateMarketInfo = async () => {
    const accountAddress = settings.selectedAddress;
    if (!accountAddress || !settings.decimals || !settings.markets || isMarketInfoUpdating) {
      return;
    }
    const appContract = getComptrollerContract();
    const vaiControllerContract = getVaiControllerContract();
    const vaiContract = getVaiTokenContract();

    setMarketInfoUpdating(true);

    try {
      let [
        userVaiBalance,
        userVaiMinted,
        { 1: mintableVai },
        allowBalance
      ] = await Promise.all([
        methods.call(vaiContract.methods.balanceOf, [accountAddress]),
        methods.call(appContract.methods.mintedVAIs, [accountAddress]),
        methods.call(vaiControllerContract.methods.getMintableVAI, [accountAddress]),
        methods.call(vaiContract.methods.allowance, [accountAddress, constants.CONTRACT_VAI_UNITROLLER_ADDRESS]),
      ]);
      userVaiBalance = new BigNumber(userVaiBalance).div(new BigNumber(10).pow(18));
      userVaiMinted = new BigNumber(userVaiMinted).div(new BigNumber(10).pow(18));
      mintableVai = new BigNumber(mintableVai).div(new BigNumber(10).pow(18));
      allowBalance = new BigNumber(allowBalance).div(new BigNumber(10).pow(18));
  
      const userVaiEnabled = allowBalance.isGreaterThanOrEqualTo(userVaiMinted);
      const assetsIn = await methods.call(appContract.methods.getAssetsIn, [
        accountAddress
      ]);

      let totalBorrowLimit = new BigNumber(0);
      let totalBorrowBalance = new BigNumber(0);
      
      const assetList = await Promise.all(Object.values(constants.CONTRACT_TOKEN_ADDRESS).map(async (item, index) => {
        if (!settings.decimals[item.id]) {
          return;
        }

        let market = settings.markets.find(
          ele => ele.underlyingSymbol === item.symbol
        );
        if (!market) market = {};
        const asset = {
          key: index,
          id: item.id,
          img: item.asset,
          vimg: item.vasset,
          name: market.underlyingSymbol || '',
          symbol: market.underlyingSymbol || '',
          tokenAddress: market.underlyingAddress,
          vsymbol: market.symbol,
          vtokenAddress: constants.CONTRACT_VBEP_ADDRESS[item.id].address,
          supplyApy: new BigNumber(market.supplyApy || 0),
          borrowApy: new BigNumber(market.borrowApy || 0),
          xvsSupplyApy: new BigNumber(market.supplyVenusApy || 0),
          xvsBorrowApy: new BigNumber(market.borrowVenusApy || 0),
          collateralFactor: new BigNumber(market.collateralFactor || 0).div(1e18),
          tokenPrice: new BigNumber(market.tokenPrice || 0),
          liquidity: new BigNumber(market.liquidity || 0),
          borrowCaps: new BigNumber(market.borrowCaps || 0),
          totalBorrows: new BigNumber(market.totalBorrows2 || 0),
          walletBalance: new BigNumber(0),
          supplyBalance: new BigNumber(0),
          borrowBalance: new BigNumber(0),
          isEnabled: false,
          collateral: false,
          percentOfLimit: '0'
        };

        const tokenDecimal = settings.decimals[item.id].token;
        const vBepContract = getVbepContract(item.id);
        asset.collateral = assetsIn.map(item => item.toLowerCase()).includes(asset.vtokenAddress.toLowerCase());

        let borrowBalance, supplyBalance, totalBalance;

        // wallet balance
        if (item.id !== 'bnb') {
          const tokenContract = getTokenContract(item.id);
          const [walletBalance, allowBalance, snapshot, balance] = await Promise.all([
            methods.call(tokenContract.methods.balanceOf, [accountAddress]),
            methods.call(tokenContract.methods.allowance, [accountAddress, asset.vtokenAddress]),
            methods.call(vBepContract.methods.getAccountSnapshot, [accountAddress]),
            methods.call(vBepContract.methods.balanceOf, [accountAddress])
          ]);
          supplyBalance = new BigNumber(snapshot[1]).times(new BigNumber(snapshot[3])).div(
            new BigNumber(10).pow(18)
          );
          borrowBalance = snapshot[2];
          totalBalance = balance;

          asset.walletBalance = new BigNumber(walletBalance).div(
            new BigNumber(10).pow(tokenDecimal)
          );

          // allowance
          asset.isEnabled = new BigNumber(allowBalance)
            .div(new BigNumber(10).pow(tokenDecimal))
            .isGreaterThan(asset.walletBalance);
        } else {
          const [snapshot, balance, walletBalance] = await Promise.all([
            methods.call(vBepContract.methods.getAccountSnapshot, [accountAddress]),
            methods.call(vBepContract.methods.balanceOf, [accountAddress]),
            window.ethereum && window.web3.eth.getBalance(accountAddress)
          ]);
          supplyBalance = new BigNumber(snapshot[1]).times(new BigNumber(snapshot[3])).div(
            new BigNumber(10).pow(18)
          );
          borrowBalance = snapshot[2];
          totalBalance = balance;

          if (window.ethereum) {
            asset.isEnabled = true;
            asset.walletBalance = new BigNumber(walletBalance).div(
              new BigNumber(10).pow(tokenDecimal)
            );
          }
        }

        // supply balance
        asset.supplyBalance = new BigNumber(supplyBalance).div(
          new BigNumber(10).pow(tokenDecimal)
        );

        // borrow balance
        asset.borrowBalance = new BigNumber(borrowBalance).div(
          new BigNumber(10).pow(tokenDecimal)
        );

        // percent of limit
        asset.percentOfLimit = new BigNumber(settings.totalBorrowLimit).isZero()
          ? '0'
          : asset.borrowBalance
              .times(asset.tokenPrice)
              .div(settings.totalBorrowLimit)
              .times(100)
              .dp(0, 1)
              .toString(10);

        // hypotheticalLiquidity
        asset.hypotheticalLiquidity = await methods.call(
          appContract.methods.getHypotheticalAccountLiquidity,
          [accountAddress, asset.vtokenAddress, totalBalance, 0]
        );


        const supplyBalanceUSD = asset.supplyBalance.times(asset.tokenPrice);
        const borrowBalanceUSD = asset.borrowBalance.times(asset.tokenPrice);

        totalBorrowBalance = totalBorrowBalance.plus(borrowBalanceUSD);
        if (asset.collateral) {
          totalBorrowLimit = totalBorrowLimit.plus(supplyBalanceUSD.times(asset.collateralFactor));
        }

        return asset;
      }));
      
      setMarketInfoUpdating(false);
      
      setSetting({
        assetList,
        userVaiMinted,
        totalBorrowLimit: totalBorrowLimit.toString(10),
        totalBorrowBalance,
        userVaiBalance,
        userVaiEnabled,
        mintableVai,
      });
    } catch (error) {
      console.log(error);
      setMarketInfoUpdating(false);
    }
  };

  const handleAccountChange = async () => {
    await updateMarketInfo();
    setSetting({
      accountLoading: false
    });
  };

  useEffect(() => {
    updateMarketInfo();
  }, [settings.markets, settings.selectedAddress]);

  useEffect(() => {
    if (settings.accountLoading) {
      handleAccountChange();
    }
  }, [settings.accountLoading]);

  return (
    <MainLayout title="Dashboard">
      <DashboardWrapper className="flex">
        {(!settings.selectedAddress || settings.accountLoading || settings.wrongNetwork) && (
          <SpinnerWrapper>
            <LoadingSpinner />
          </SpinnerWrapper>
        )}
        {settings.selectedAddress && !settings.accountLoading && !settings.wrongNetwork && (
          <Row>
            <Column xs="12" sm="12" md="5">
              <Row>
                <Column xs="12">
                  <CoinInfo />
                </Column>
                <Column xs="12">
                  <VaiInfo />
                </Column>
                <Column xs="12">
                  <BorrowLimit />
                </Column>
                <Column xs="12">
                  <Overview />
                </Column>
              </Row>
            </Column>
            <Column xs="12" sm="12" md="7">
              <Row>
                <Column xs="12">
                  <WalletBalance />
                </Column>
                <Column xs="12">
                  <Market />
                </Column>
              </Row>
            </Column>
          </Row>
        )}
      </DashboardWrapper>
    </MainLayout>
  );
}

Dashboard.propTypes = {
  settings: PropTypes.object,
  setSetting: PropTypes.func.isRequired
};

Dashboard.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(Dashboard);
