import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';

import { getToken } from 'utilities';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import useRefresh from 'hooks/useRefresh';
import { getTokenContractByAddress } from 'clients/contracts/getters';
import { useWeb3 } from 'clients/web3';
import { TokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import WithdrawHistoryModal from './WithdrawHistoryModal';
import WithdrawCard from './WithdrawCard';
import LoadingSpinner from '../../Basic/LoadingSpinner';
import { CardItemWrapper } from '../styles';

const CardContentWrapper = styled.div`
  color: #fff;
  padding: 16px 40px 0 24px;
  .loading-spinner {
    margin: 16px 0;
  }
`;

interface CardContentProps {
  poolId: BigNumber;
  stakedToken: TokenId;
  rewardToken: TokenId;
  userStakedAmount: BigNumber;
  pendingReward: BigNumber;
  lockPeriodSecond: BigNumber;
}

function CardContent({
  poolId,
  stakedToken,
  rewardToken,
  userStakedAmount,
  pendingReward,
  lockPeriodSecond,
}: CardContentProps) {
  const stakedTokenDecimal = new BigNumber(10).pow(getToken(stakedToken).decimals);
  const rewardTokenDecimal = new BigNumber(10).pow(getToken(rewardToken).decimals);
  const { account } = useContext(AuthContext);
  const { fastRefresh } = useRefresh();
  const web3 = useWeb3();

  // user info
  const [stakeAmount, setStakeAmount] = useState(new BigNumber(0));
  const [userStakedTokenBalance, setUserStakedTokenBalance] = useState(new BigNumber(0));
  const [userStakedTokenAllowance, setUserStakedTokenAllowance] = useState(new BigNumber(0));
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [withdrawableAmount, setWithdrawableAmount] = useState(new BigNumber(0));
  const [userEligibleStakedAmount, setUserEligibleStakedAmount] = useState(new BigNumber(0));
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  // button loading status
  const [claimLoading, setClaimLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false); // also applies to enabling

  const stakedTokenAddress = getToken(stakedToken).address;
  const rewardTokenAddress = getToken(rewardToken).address;

  const xvsVaultContract = useXvsVaultProxyContract();
  const stakedTokenContract = getTokenContractByAddress(stakedTokenAddress, web3);

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '() => Promise<() => void>' is no... Remove this comment to see the full error message
  useEffect(async () => {
    let isMounted = true;
    let [balance, allowance, withdrawals] = ['0', '0', [['0', '0']]];
    if (account) {
      [balance, allowance, withdrawals] = await Promise.all([
        stakedTokenContract.methods.balanceOf(account.address).call(),
        stakedTokenContract.methods
          .allowance(account.address, xvsVaultContract.options.address)
          .call(),
        xvsVaultContract.methods
          .getWithdrawalRequests(rewardTokenAddress, poolId.toNumber(), account.address)
          .call(),
      ]);
    }
    // finish loading
    setLoading(false);

    if (isMounted) {
      setUserStakedTokenBalance(new BigNumber(balance));
      setUserStakedTokenAllowance(new BigNumber(allowance));

      const pendingWithdrawalsTemp = withdrawals.map(withdrawal => ({
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'amount' does not exist on type 'never'.
        amount: new BigNumber(withdrawal.amount),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'lockedUntil' does not exist on type 'nev... Remove this comment to see the full error message
        lockedUntil: new BigNumber(withdrawal.lockedUntil),
        eligible: false,
      }));

      // the amount of all the eligible withdrawals,
      // let's just calculated locally to avoid more network requests
      setWithdrawableAmount(
        withdrawals.reduce((target, widthdrawal, i) => {
          if (
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'lockedUntil' does not exist on type 'nev... Remove this comment to see the full error message
            new BigNumber(widthdrawal.lockedUntil).multipliedBy(1000).lt(Date.now())
          ) {
            // we assign the eligible check result for later usage
            // eslint-disable-next-line no-param-reassign
            pendingWithdrawalsTemp[i].eligible = true;
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'amount' does not exist on type 'never'.
            return target.plus(new BigNumber(widthdrawal.amount));
          }
          return target;
        }, new BigNumber(0)),
      );

      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ amount: BigNumber; lockedUntil... Remove this comment to see the full error message
      setPendingWithdrawals(pendingWithdrawalsTemp);

      // the amount of all the withdrawals user requested, eligible or not
      const pendWithdrawalTotalTemp = pendingWithdrawalsTemp.reduce(
        (target, widthdrawal) => target.plus(widthdrawal.amount),
        new BigNumber(0),
      );

      // pending withdrawals should not be accounted into staked amount
      setUserEligibleStakedAmount(userStakedAmount.minus(pendWithdrawalTotalTemp));
    }
    return () => {
      isMounted = false;
    };
  }, [fastRefresh, account, userStakedAmount]);

  if (loading) {
    return (
      <CardContentWrapper>
        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ className: string; }' is not assignable to... Remove this comment to see the full error message */}
        <LoadingSpinner className="loading-spinner" />
      </CardContentWrapper>
    );
  }

  return (
    <CardContentWrapper>
      <Row justify="end" type="flex">
        {/* claim area */}
        <Col lg={{ span: 6 }} xs={{ span: 24 }}>
          <CardItemWrapper>
            <div className="card-item claim-rewards">
              <div>
                <div className="card-title">Available Rewards</div>
                <div className="center-amount">
                  {pendingReward.div(rewardTokenDecimal).dp(6, 1).toString(10)}{' '}
                  {rewardToken.toUpperCase()}
                </div>
              </div>
              <button
                type="button"
                className="button claim-button"
                disabled={!pendingReward.gt(0) || !account || claimLoading}
                onClick={async () => {
                  setClaimLoading(true);
                  try {
                    await xvsVaultContract.methods
                      .deposit(rewardTokenAddress, poolId.toNumber(), 0)
                      .send({ from: account?.address });
                  } catch (e) {
                    console.log('>> claim reward error:  ', e);
                  }
                  setClaimLoading(false);
                }}
              >
                {claimLoading && <Icon type="loading" />} Claim
              </button>
            </div>
          </CardItemWrapper>
        </Col>

        {/* withdraw area */}
        <Col lg={{ span: 11 }} xs={{ span: 24 }}>
          <WithdrawCard
            poolId={poolId}
            stakedToken={stakedToken}
            rewardTokenAddress={rewardTokenAddress}
            lockPeriodSecond={lockPeriodSecond}
            withdrawableAmount={withdrawableAmount}
            pendingWithdrawals={pendingWithdrawals}
            userEligibleStakedAmount={userEligibleStakedAmount}
          />
        </Col>

        {/* stake area */}
        <Col lg={{ span: 7 }} xs={{ span: 24 }}>
          <CardItemWrapper>
            <div className="card-item stake">
              <div className="withdraw-request">
                <div className="card-title">
                  Available {stakedToken.toUpperCase()} to stake:{' '}
                  {userStakedTokenBalance.div(stakedTokenDecimal).toFixed(4)}
                </div>
                <div className="input-wrapper">
                  <NumberFormat
                    autoFocus
                    value={stakeAmount.isZero() ? '0' : stakeAmount.toString(10)}
                    onValueChange={values => {
                      const value = new BigNumber(values.value || 0);
                      const maxValue = userStakedTokenBalance.div(stakedTokenDecimal).dp(4, 1);
                      setStakeAmount(value.gt(maxValue) ? maxValue : value);
                    }}
                    thousandSeparator
                    allowNegative={false}
                    placeholder="0"
                  />
                  <span
                    className="pointer max"
                    onClick={() => {
                      setStakeAmount(userStakedTokenBalance.div(stakedTokenDecimal));
                    }}
                  >
                    MAX
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="button stake-button"
                disabled={!account || !stakeAmount.gt(0) || stakeLoading}
                onClick={async () => {
                  setStakeLoading(true);
                  try {
                    if (!userStakedTokenAllowance.gt(0)) {
                      await stakedTokenContract.methods
                        .approve(
                          xvsVaultContract.options.address,
                          new BigNumber(2).pow(256).minus(1).toString(10),
                        )
                        .send({
                          from: account?.address,
                        });
                    } else {
                      await xvsVaultContract.methods
                        .deposit(
                          rewardTokenAddress,
                          poolId.toNumber(),
                          stakeAmount.multipliedBy(1e18).toString(10),
                        )
                        .send({ from: account?.address });
                    }
                  } catch (e) {
                    console.log('>> stake error:', e);
                  }
                  setStakeLoading(false);
                }}
              >
                {stakeLoading && <Icon type="loading" />}{' '}
                {userStakedTokenAllowance.gt(0) ? 'Stake' : 'Enable'}
              </button>
            </div>
          </CardItemWrapper>
        </Col>
      </Row>
      <WithdrawHistoryModal
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        pendingWithdrawals={pendingWithdrawals}
        withdrawableAmount={withdrawableAmount}
        stakedToken={stakedToken}
      />
    </CardContentWrapper>
  );
}

export default CardContent;
