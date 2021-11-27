/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import BigNumber from 'bignumber.js';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount, accountActionCreators } from 'core';
import { useWeb3React } from '@web3-react/core';
import LoadingSpinner from '../../components/Basic/LoadingSpinner';
import useWeb3 from '../../hooks/useWeb3';
import useRefresh from '../../hooks/useRefresh';
import { useXvsVaultProxy } from '../../hooks/useContract';
import * as constants from '../../utilities/constants';
import GeneralVaultPoolCard from '../../components/Vault/Card';
import VaiPoolCard from '../../components/Vault/VaiCard';
import { getTokenContractByAddress } from '../../utilities/contractHelpers';

const VaultWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 24px;
`;

// fast search token name by address
const tokenAddressNameMap = Object.keys(
  constants.CONTRACT_TOKEN_ADDRESS
).reduce((target, token) => {
  return {
    ...target,
    [constants.CONTRACT_TOKEN_ADDRESS[token].address]: token
  };
}, {});

function Vault({ settings }) {
  // todo: test
  const [poolInfos, setPoolInfos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { account } = useWeb3React();
  const web3 = useWeb3();
  const { fastRefresh } = useRefresh();
  const xvsVaultContract = useXvsVaultProxy();

  // total info
  useEffect(async () => {
    let mounted = true;
    // added pool: vai->xvs, xvs->xvs, vrt->vrt(todo)
    const xvsTokenAddress = constants.CONTRACT_TOKEN_ADDRESS.xvs.address;
    const vaiTokenAddress = constants.CONTRACT_TOKEN_ADDRESS.vai.address;

    // here we just simply list the pool parameters, instead of fetching the pools
    // by past events, which should be appeared but didn't info.token is the STAKED token
    // parameter: rewardToken, stakedToken, pid
    // @todo: maybe we can make a backend api to improve this.
    const fetchPoolParameters = [
      { rewardToken: xvsTokenAddress, stakedToken: xvsTokenAddress, pid: 0 }
      // [vrtTokenAddress, vrtTokenAddress, 0]
    ];

    async function fetchOnePool(param) {
      const [
        poolInfo,
        rewardPerBlock,
        totalStaked,
        totalAllocPoints
      ] = await Promise.all([
        xvsVaultContract.methods.poolInfos(param.rewardToken, param.pid).call(),
        xvsVaultContract.methods
          .rewardTokenAmountsPerBlock(param.rewardToken)
          .call(),

        getTokenContractByAddress(web3, param.stakedToken)
          .methods.balanceOf(xvsVaultContract.options.address)
          .call(),

        xvsVaultContract.methods.totalAllocPoints(param.rewardToken).call()
      ]);

      let [userPendingRewards, userInfo] = [
        '0',
        {
          amount: '0',
          pendingWithdrawals: [],
          rewardDebt: '0'
        }
      ];

      if (account) {
        [userPendingRewards, userInfo] = await Promise.all([
          xvsVaultContract.methods
            .pendingReward(param.rewardToken, param.pid, account)
            .call(),
          xvsVaultContract.methods
            .getUserInfo(param.stakedToken, param.pid, account)
            .call()
        ]);
      }

      const rewardPerBlockOfPool = new BigNumber(rewardPerBlock)
        .multipliedBy(poolInfo.allocPoint)
        .div(totalAllocPoints);
      const blockPerDay = 86400 / 3; // per 3 seconds for a block
      const dailyEmission = new BigNumber(rewardPerBlockOfPool).multipliedBy(
        blockPerDay
      );

      return {
        poolId: new BigNumber(param.pid),
        stakedToken: tokenAddressNameMap[param.stakedToken],
        rewardToken: tokenAddressNameMap[param.rewardToken],
        pendingReward: new BigNumber(userPendingRewards),
        userStakedAmount: new BigNumber(userInfo.amount),
        lockPeriodSecond: new BigNumber(poolInfo.lockPeriod),
        apr: new BigNumber(dailyEmission).multipliedBy(365).div(totalStaked),
        totalStaked: new BigNumber(totalStaked),
        dailyEmission
      };
    }

    const patchedPoolInfos = await Promise.all(
      fetchPoolParameters.map(param => fetchOnePool(param))
    );

    setLoading(false);

    if (mounted) {
      setPoolInfos(patchedPoolInfos);
    }

    return () => {
      mounted = false;
    };
  }, [fastRefresh, account]);

  return (
    <MainLayout title="Vault">
      {loading && <LoadingSpinner />}
      {!loading && (
        <VaultWrapper>
          <VaiPoolCard />
          {poolInfos.map((poolInfo, index) => {
            return (
              <GeneralVaultPoolCard
                key={index}
                poolId={poolInfo.poolId}
                stakedToken={poolInfo.stakedToken}
                rewardToken={poolInfo.rewardToken}
                userStakedAmount={poolInfo.userStakedAmount}
                pendingReward={poolInfo.pendingReward}
                lockPeriodSecond={poolInfo.lockPeriodSecond}
                apr={poolInfo.apr}
                totalStaked={poolInfo.totalStaked}
                dailyEmission={poolInfo.dailyEmission}
              />
            );
          })}
        </VaultWrapper>
      )}
    </MainLayout>
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
