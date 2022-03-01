/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount } from 'core';
import { useWeb3React } from '@web3-react/core';
import { uid } from 'react-uid';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import useWeb3 from 'hooks/useWeb3';
import useRefresh from 'hooks/useRefresh';
import { useXvsVaultProxy } from 'hooks/useContract';
import * as constants from 'utilities/constants';
import GeneralVaultPoolCard from 'components/Vault/VestingVault/Card';
import VaiPoolCard from 'components/Vault/BasicVault/VaiCard';
import VrtPoolCard from 'components/Vault/BasicVault/VrtCard';
import { getTokenContractByAddress } from 'utilities/contractHelpers';

const VaultWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 24px;
`;

// fast search token name by address
const tokenAddressNameMap = Object.keys(constants.CONTRACT_TOKEN_ADDRESS).reduce(
  (target, token) => ({
    ...target,
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    [constants.CONTRACT_TOKEN_ADDRESS[token].address]: token,
  }),
  {},
);

function Vault() {
  const [poolInfos, setPoolInfos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { account } = useWeb3React();
  const web3 = useWeb3();
  const { fastRefresh } = useRefresh();
  const xvsVaultContract = useXvsVaultProxy();

  // fetch XVS vault pools info
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '() => Promise<() => void>' is no... Remove this comment to see the full error message
  useEffect(async () => {
    let mounted = true;
    // added pool: vai->xvs, xvs->xvs, vrt->vrt(todo)
    const xvsTokenAddress = constants.CONTRACT_TOKEN_ADDRESS.xvs.address;

    const xvsTokenPoolLength = await xvsVaultContract.methods.poolLength(xvsTokenAddress).call();

    const fetchPoolParameters = Array.from({ length: xvsTokenPoolLength }).map((_, index) => ({
      rewardToken: xvsTokenAddress,
      pid: index,
    }));

    async function fetchOnePool(param: $TSFixMe) {
      const [poolInfo, rewardPerBlock, totalAllocPoints] = await Promise.all([
        xvsVaultContract.methods.poolInfos(param.rewardToken, param.pid).call(),
        xvsVaultContract.methods.rewardTokenAmountsPerBlock(param.rewardToken).call(),

        xvsVaultContract.methods.totalAllocPoints(param.rewardToken).call(),
      ]);

      const totalStaked = await getTokenContractByAddress(web3, poolInfo.token)
        .methods.balanceOf(xvsVaultContract.options.address)
        .call();

      let [userPendingRewards, userInfo] = [
        '0',
        {
          amount: '0',
          pendingWithdrawals: [],
          rewardDebt: '0',
        },
      ];

      if (account) {
        [userPendingRewards, userInfo] = await Promise.all([
          xvsVaultContract.methods.pendingReward(param.rewardToken, param.pid, account).call(),
          xvsVaultContract.methods.getUserInfo(param.rewardToken, param.pid, account).call(),
        ]);
      }

      const rewardPerBlockOfPool = new BigNumber(rewardPerBlock)
        .multipliedBy(poolInfo.allocPoint)
        .div(totalAllocPoints);
      const blockPerDay = 86400 / 3; // per 3 seconds for a block
      const dailyEmission = new BigNumber(rewardPerBlockOfPool).multipliedBy(blockPerDay);

      return {
        poolId: new BigNumber(param.pid),
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        stakedToken: tokenAddressNameMap[poolInfo.token],
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        rewardToken: tokenAddressNameMap[param.rewardToken],
        pendingReward: new BigNumber(userPendingRewards),
        userStakedAmount: new BigNumber(userInfo.amount),
        lockPeriodSecond: new BigNumber(poolInfo.lockPeriod),
        apr: new BigNumber(dailyEmission).multipliedBy(365).div(totalStaked),
        totalStaked: new BigNumber(totalStaked),
        dailyEmission,
      };
    }

    const patchedPoolInfos = await Promise.all(
      fetchPoolParameters.map(param => fetchOnePool(param)),
    );

    setLoading(false);

    if (mounted) {
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ poolId: BigNumber; stakedToken... Remove this comment to see the full error message
      setPoolInfos(patchedPoolInfos);
    }

    return () => {
      mounted = false;
    };
  }, [fastRefresh, account]);


  return (
    <MainLayout title="Vault">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <VaultWrapper>
          <VaiPoolCard />
          <VrtPoolCard />
          {poolInfos.map(poolInfo => (
            <GeneralVaultPoolCard
              key={uid(poolInfo)}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'poolId' does not exist on type 'never'.
              poolId={poolInfo.poolId}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'stakedToken' does not exist on type 'nev... Remove this comment to see the full error message
              stakedToken={poolInfo.stakedToken}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'rewardToken' does not exist on type 'nev... Remove this comment to see the full error message
              rewardToken={poolInfo.rewardToken}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'userStakedAmount' does not exist on type... Remove this comment to see the full error message
              userStakedAmount={poolInfo.userStakedAmount}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'pendingReward' does not exist on type 'n... Remove this comment to see the full error message
              pendingReward={poolInfo.pendingReward}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'lockPeriodSecond' does not exist on type... Remove this comment to see the full error message
              lockPeriodSecond={poolInfo.lockPeriodSecond}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'apr' does not exist on type 'never'.
              apr={poolInfo.apr}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalStaked' does not exist on type 'nev... Remove this comment to see the full error message
              totalStaked={poolInfo.totalStaked}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'dailyEmission' does not exist on type 'n... Remove this comment to see the full error message
              dailyEmission={poolInfo.dailyEmission}
            />
          ))}
        </VaultWrapper>
      )}
    </MainLayout>
  );
}

const mapStateToProps = ({ account }: $TSFixMe) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(withRouter(Vault));
