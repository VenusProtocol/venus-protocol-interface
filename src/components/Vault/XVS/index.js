/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import BigNumber from 'bignumber.js';
import * as constants from 'utilities/constants';
import XVSTotalInfo from 'components/Vault/XVS/TotalInfo';
import XVSStaking from 'components/Vault/XVS/Staking';
import { connectAccount, accountActionCreators } from 'core';
import {
  getVaultContract,
  getTokenContract,
  methods
} from 'utilities/ContractService';
import { Row, Column } from 'components/Basic/Style';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '../../../hooks/useRefresh';

function Vault({ settings }) {
  const [vaultInfo, setVaultInfo] = useState({
    totalStaked: new BigNumber(0),
    dailyEmission: new BigNumber(0),
    apy: new BigNumber(0),
    totalPendingRewards: new BigNumber(0)
  });
  const [userInfo, setUserInfo] = useState({
    walletBalance: new BigNumber(0),
    stakedAmount: new BigNumber(0),
    enabled: false,
    pendingReward: new BigNumber(0),
    withdrawableAmount: new BigNumber(0),
    requestedAmount: new BigNumber(0)
  });
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();

  const xvsTokenContract = getTokenContract('xvs');
  const vaultContract = getVaultContract();
  const vaultAddress = constants.CONTRACT_VAULT_ADDRESS;
  const xvsAddress = constants.CONTRACT_TOKEN_ADDRESS['xvs'].address;
  const xvsStoreAddress = constants.CONTRACT_XVS_STORE_ADDRESS;

  const fetchVaults = useCallback(async () => {
    const [
      totalStaked,
      rewardPerBlock,
      totalAllocPoints,
      { 1: allocPoint },
      totalPendingRewards
    ] = await Promise.all([
      methods.call(xvsTokenContract.methods.balanceOf, [vaultAddress]),
      methods.call(vaultContract.methods.rewardTokenAmountsPerBlock, [
        xvsAddress
      ]),
      methods.call(vaultContract.methods.totalAllocPoints, [xvsAddress]),
      methods.call(vaultContract.methods.poolInfos, [xvsAddress, 0]),
      methods.call(xvsTokenContract.methods.balanceOf, [xvsStoreAddress])
    ]);

    const rewardPerVault = new BigNumber(rewardPerBlock)
      .times(allocPoint)
      .div(totalAllocPoints);
    setVaultInfo({
      totalStaked: new BigNumber(totalStaked).div(1e18),
      dailyEmission: rewardPerVault.div(1e18).times(20 * 60 * 24),
      apy: new BigNumber(totalStaked).isZero()
        ? new BigNumber(0)
        : rewardPerVault.times(20 * 60 * 24 * 365).div(totalStaked),
      totalPendingRewards: new BigNumber(totalPendingRewards).div(1e18)
    });
  }, [fastRefresh]);

  const fetchVaultsUser = useCallback(async () => {
    const rewardAddress = xvsAddress;
    const [
      walletBalance,
      allowance,
      { 0: stakedAmount },
      pendingReward,
      withdrawableAmount,
      requestedAmount
    ] = await Promise.all([
      methods.call(xvsTokenContract.methods.balanceOf, [account]),
      methods.call(xvsTokenContract.methods.allowance, [account, vaultAddress]),
      methods.call(vaultContract.methods.getUserInfo, [
        rewardAddress,
        0,
        account
      ]),
      methods.call(vaultContract.methods.pendingReward, [
        rewardAddress,
        0,
        account
      ]),
      methods.call(vaultContract.methods.getEligibleWithdrawalAmount, [
        rewardAddress,
        0,
        account
      ]),
      methods.call(vaultContract.methods.getRequestedAmount, [
        rewardAddress,
        0,
        account
      ])
    ]);

    setUserInfo({
      walletBalance: new BigNumber(walletBalance).div(1e18),
      stakedAmount: new BigNumber(stakedAmount).div(1e18),
      enabled: !new BigNumber(allowance).isZero(),
      pendingReward: new BigNumber(pendingReward).div(1e18),
      withdrawableAmount: new BigNumber(withdrawableAmount).div(1e18),
      requestedAmount: new BigNumber(requestedAmount).div(1e18)
    });
  }, [account, fastRefresh]);

  useEffect(() => {
    fetchVaults();

    if (account) {
      fetchVaultsUser();
    }
  }, [fastRefresh]);

  return (
    <Row>
      <Column xs="12">
        <XVSTotalInfo vaultInfo={vaultInfo} />
      </Column>
      <Column xs="12">
        <XVSStaking userInfo={userInfo} rewardAddress={xvsAddress} />
      </Column>
    </Row>
  );
}

Vault.propTypes = {
  settings: PropTypes.object
};

Vault.defaultProps = {
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
)(Vault);
