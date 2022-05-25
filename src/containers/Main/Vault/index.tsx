import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { connectAccount } from 'core';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { useWeb3 } from 'clients/web3';
import useRefresh from 'hooks/useRefresh';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import { getToken } from 'utilities';
import { TOKENS } from 'constants/tokens';
import GeneralVaultPoolCard from 'components/Vault/VestingVault/Card';
import VaiPoolCard from 'components/Vault/BasicVault/VaiCard';
import VrtPoolCard from 'components/Vault/BasicVault/VrtCard';
import { getTokenContractByAddress } from 'clients/contracts/getters';
import { IPool, TokenId } from 'types';
import { State } from 'core/modules/initialState';
import { AuthContext } from 'context/AuthContext';

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
    const { address } = getToken(token as TokenId) || {};
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

  const { account } = useContext(AuthContext);
  const web3 = useWeb3();
  const { fastRefresh } = useRefresh();
  const xvsVaultContract = useXvsVaultProxyContract();

  // fetch XVS vault pools info
  useEffect(() => {
    isMountedRef.current = true;

    const fetchPools = async () => {
      // added pool: vai->xvs, xvs->xvs, vrt->vrt(todo)
      const xvsTokenAddress = TOKENS.xvs.address;

      const fetchedXvsTokenPoolLength = await xvsVaultContract.methods
        .poolLength(xvsTokenAddress)
        .call();
      const xvsTokenPoolLength = +fetchedXvsTokenPoolLength;

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

        const totalStaked = await getTokenContractByAddress(poolInfo.token, web3)
          .methods.balanceOf(xvsVaultContract.options.address)
          .call();

        let [userPendingRewards, userInfo] = [
          '0',
          {
            amount: '0',
            pendingWithdrawals: '',
            rewardDebt: '0',
          },
        ];

        if (account) {
          [userPendingRewards, userInfo] = await Promise.all([
            xvsVaultContract.methods
              .pendingReward(param.rewardToken, param.pid, account.address)
              .call(),
            xvsVaultContract.methods
              .getUserInfo(param.rewardToken, param.pid, account.address)
              .call(),
          ]);
        }

        const rewardPerBlockOfPool = new BigNumber(rewardPerBlock)
          .multipliedBy(poolInfo.allocPoint)
          .div(totalAllocPoints);
        const blockPerDay = 86400 / 3; // per 3 seconds for a block
        const dailyEmission = new BigNumber(rewardPerBlockOfPool).multipliedBy(blockPerDay);

        return {
          poolId: new BigNumber(param.pid),
          stakedToken: tokenAddressNameMap[poolInfo.token] as TokenId,
          rewardToken: tokenAddressNameMap[param.rewardToken] as TokenId,
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
