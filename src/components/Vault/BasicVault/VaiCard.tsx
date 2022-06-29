// We put the code of UI of old VAI pool (which will be live for quite some time) into this seperated
// file, instead of merging its logic into general pool UI which is in `./Card.js` thus we can easily
// remove this VAI pool code in the future when it's about to be deprecated
import React, { useState, useEffect, useContext } from 'react';

import BigNumber from 'bignumber.js';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { useGetMarkets } from 'clients/api';
import useRefresh from 'hooks/useRefresh';
import {
  useComptrollerContract,
  useTokenContract,
  useVaiVaultContract,
} from 'clients/contracts/hooks';
import { getContractAddress, convertWeiToTokens } from 'utilities';
import { AuthContext } from 'context/AuthContext';
import CardContent from './CardContent';
import CardHeader from './CardHeader';
import { VaultCardWrapper } from '../styles';

function VaultCard() {
  const { account } = useContext(AuthContext);
  const { fastRefresh } = useRefresh();

  const compContract = useComptrollerContract();
  const vaiTokenContract = useTokenContract('vai');
  const vaiVaultContract = useVaiVaultContract();
  const vaiVaultAddress = getContractAddress('vaiVault');

  const [dailyEmission, setDailyEmission] = useState(new BigNumber(0));
  const [userVaiAllowance, setUserVaiAllowance] = useState(new BigNumber(0));
  const [userVaiStakedAmount, setUserVaiStakedAmount] = useState(new BigNumber(0));
  const [totalVaiStakedTokens, setTotalVaiStakedTokens] = useState(new BigNumber(0));
  const [userVaiBalance, setUserVaiBalance] = useState(new BigNumber(0));
  const [userPendingReward, setUserPendingReward] = useState(new BigNumber(0));
  const [vaiAPY, setVaiAPY] = useState(0);

  const [expanded, setExpanded] = useState(false);

  const { data: getMarketsData } = useGetMarkets();

  const xvsMarket = getMarketsData?.markets.find(market => market.underlyingSymbol === 'XVS');

  useEffect(() => {
    let isMounted = true;

    const fn = async () => {
      if (!xvsMarket) {
        return;
      }

      const venusVAIVaultRate = await compContract.methods.venusVAIVaultRate().call();
      const formattedVenusVAIVaultRate = convertWeiToTokens({
        valueWei: new BigNumber(venusVAIVaultRate),
        tokenId: 'vai',
      }).times(BLOCKS_PER_DAY);

      if (isMounted) {
        const formattedVaiAPY = new BigNumber(formattedVenusVAIVaultRate)
          .times(xvsMarket.tokenPrice)
          .times(DAYS_PER_YEAR * 100)
          .div(totalVaiStakedTokens)
          .dp(2, 1)
          .toNumber();

        setVaiAPY(formattedVaiAPY);
      }
    };

    fn();

    return () => {
      isMounted = false;
    };
  }, [xvsMarket, totalVaiStakedTokens.toFixed()]);

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '() => Promise<() => void>' is no... Remove this comment to see the full error message
  useEffect(async () => {
    let isMounted = true;

    let userVaiBalanceTemp = '0';
    let userVaiStakedAmountTemp = '0';
    let userPendingRewardTemp = '0';
    let userVaiAllowanceTemp = '0';

    const [venusVAIVaultRateTemp, totalVaiStakedWei] = await Promise.all([
      compContract.methods.venusVAIVaultRate().call(),
      vaiTokenContract.methods.balanceOf(vaiVaultAddress).call(),
    ]);

    // Total Vai Staked
    setTotalVaiStakedTokens(
      convertWeiToTokens({
        valueWei: new BigNumber(totalVaiStakedWei),
        tokenId: 'vai',
      }),
    );

    if (account) {
      [
        userVaiBalanceTemp,
        { 0: userVaiStakedAmountTemp },
        userPendingRewardTemp,
        userVaiAllowanceTemp,
      ] = await Promise.all([
        vaiTokenContract.methods.balanceOf(account.address).call(),
        vaiVaultContract.methods.userInfo(account.address).call(),
        vaiVaultContract.methods.pendingXVS(account.address).call(),
        vaiTokenContract.methods.allowance(account.address, getContractAddress('vaiVault')).call(),
      ]);
    }

    if (isMounted) {
      // total info
      const blockPerMinute = 60 / 3;
      const blockPerDay = blockPerMinute * 60 * 24;
      setDailyEmission(
        new BigNumber(venusVAIVaultRateTemp).div(1e18).multipliedBy(blockPerDay).dp(2, 1),
      );
      setUserVaiBalance(new BigNumber(userVaiBalanceTemp));
      setUserVaiStakedAmount(new BigNumber(userVaiStakedAmountTemp));
      setUserPendingReward(new BigNumber(userPendingRewardTemp));
      setUserVaiAllowance(new BigNumber(userVaiAllowanceTemp));
    }

    return () => {
      isMounted = false;
    };
  }, [fastRefresh, account]);

  return (
    <VaultCardWrapper>
      <CardHeader
        stakedToken="VAI"
        rewardToken="XVS"
        apy={vaiAPY}
        totalStakedAmount={totalVaiStakedTokens}
        userPendingReward={userPendingReward.div(1e18)}
        dailyEmission={dailyEmission}
        onExpand={() => {
          setExpanded(!expanded);
        }}
      />
      <div className="content-container">
        {expanded && (
          <CardContent
            userPendingReward={userPendingReward}
            userStakedTokenBalance={userVaiBalance}
            userStakedAllowance={userVaiAllowance}
            userStakedAmount={userVaiStakedAmount}
            stakedToken="VAI"
            rewardToken="XVS"
            onClaimReward={async () => {
              await vaiVaultContract.methods.claim().send({ from: account?.address });
            }}
            onStake={async stakeAmount => {
              await vaiVaultContract.methods
                .deposit(stakeAmount.toFixed(0))
                .send({ from: account?.address });
            }}
            onApprove={async amt => {
              await vaiTokenContract.methods
                .approve(vaiVaultContract.options.address, amt.toFixed(0))
                .send({ from: account?.address });
            }}
            onWithdraw={async amt => {
              await vaiVaultContract.methods
                .withdraw(amt.toFixed(0))
                .send({ from: account?.address });
            }}
          />
        )}
      </div>
    </VaultCardWrapper>
  );
}

export default VaultCard;
