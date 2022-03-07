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
import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import GeneralVaultPoolCard from 'components/Vault/Card';
import VaiPoolCard from 'components/Vault/BasicVault/VaiCard';
import VrtPoolCard from 'components/Vault/BasicVault/VrtCard';
import { getTokenContractByAddress } from 'utilities/contractHelpers';
import { IPool } from 'types';
import { State } from 'core/modules/initialState';

const VaultWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 24px;
`;

// fast search token name by address
const tokenAddressNameMap = Object.keys(CONTRACT_TOKEN_ADDRESS).reduce<Record<string, string>>(
  (target: Record<string, string>, token: string) => {
    const { address } = CONTRACT_TOKEN_ADDRESS[token as keyof typeof CONTRACT_TOKEN_ADDRESS] || {};
    if (address) {
      return {
        ...target,
        [address]: token,
      };
    }
    return target;
  },
  {},
);

function Vault() {
  const [poolInfos, setPoolInfos] = useState<IPool[]>([]);
  const [loading, setLoading] = useState(true);

  const { account } = useWeb3React();
  const web3 = useWeb3();
  const { fastRefresh } = useRefresh();
  const xvsVaultContract = useXvsVaultProxy();

  // fetch XVS vault pools info
  useEffect(() => {
    let mounted = true;
    const fetchPools = async () => {
      // added pool: vai->xvs, xvs->xvs, vrt->vrt(todo)
      const xvsTokenAddress = CONTRACT_TOKEN_ADDRESS.xvs.address;

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
          stakedToken: tokenAddressNameMap[poolInfo.token],
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
        setPoolInfos(patchedPoolInfos);
      }
    };
    fetchPools();
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
          {poolInfos.map((poolInfo: IPool) => (
            <GeneralVaultPoolCard
              key={uid(poolInfo)}
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
          ))}
        </VaultWrapper>
      )}
    </MainLayout>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(withRouter(Vault));
