import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { connectAccount } from 'core';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { useWeb3, useWeb3Account } from 'clients/web3';
import useRefresh from 'hooks/useRefresh';
import { useXvsVaultProxy } from 'clients/contracts/contractHooks';
import { getToken } from 'utilities';
import { TOKENS } from 'constants/tokenContracts';
import GeneralVaultPoolCard from 'components/Vault/VestingVault/Card';
import VaiPoolCard from 'components/Vault/BasicVault/VaiCard';
import VrtPoolCard from 'components/Vault/BasicVault/VrtCard';
import { getTokenContractByAddress } from 'clients/contracts/contractHelpers';
import { IPool, TokenSymbol } from 'types';
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
const tokenAddressNameMap = Object.keys(TOKENS).reduce<Record<string, string>>(
  (target: Record<string, string>, token) => {
    const { address } = getToken(token as TokenSymbol) || {};
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
  const isMountedRef = React.useRef(false);
  const [poolInfos, setPoolInfos] = useState<IPool[]>([]);
  const [loading, setLoading] = useState(true);

  const { account } = useWeb3Account();
  const web3 = useWeb3();
  const { fastRefresh } = useRefresh();
  const xvsVaultContract = useXvsVaultProxy();

  // fetch XVS vault pools info
  useEffect(() => {
    isMountedRef.current = true;

    const fetchPools = async () => {
      // added pool: vai->xvs, xvs->xvs, vrt->vrt(todo)
      const xvsTokenAddress = TOKENS.xvs.address;

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
          stakedToken: tokenAddressNameMap[poolInfo.token] as TokenSymbol,
          rewardToken: tokenAddressNameMap[param.rewardToken] as TokenSymbol,
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

      if (isMountedRef.current) {
        setPoolInfos(patchedPoolInfos);
      }
    };

    fetchPools();

    return () => {
      isMountedRef.current = false;
    };
  }, [fastRefresh, account]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <VaultWrapper>
          <VaiPoolCard />
          <VrtPoolCard />
          {poolInfos.map(poolInfo => (
            <GeneralVaultPoolCard
              key={poolInfo.poolId.toString()}
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
    </>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(withRouter(Vault));
