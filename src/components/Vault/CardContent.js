import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import NumberFormat from 'react-number-format';
import * as constants from '../../utilities/constants';
import { useXvsVaultProxy } from '../../hooks/useContract';
import useRefresh from '../../hooks/useRefresh';
import useWeb3 from '../../hooks/useWeb3';
import { getTokenContractByAddress } from '../../utilities/contractHelpers';
import WithdrawHistoryModal from './WithdrawHistoryModal';
import WithdrawCard from './WithdrawCard';
import LoadingSpinner from '../Basic/LoadingSpinner';
import { CardItemWrapper } from './styles';

const CardContentWrapper = styled.div`
  color: #fff;
  padding: 16px 40px 0 24px;
  .loading-spinner {
    margin: 16px 0;
  }
`;

function CardContent({
  poolId,
  stakedToken,
  rewardToken,
  userStakedAmount,
  pendingReward,
  lockPeriodSecond
}) {
  const stakedTokenDecimal = new BigNumber(10).pow(
    constants.CONTRACT_TOKEN_ADDRESS[stakedToken].decimals
  );
  const rewardTokenDecimal = new BigNumber(10).pow(
    constants.CONTRACT_TOKEN_ADDRESS[rewardToken].decimals
  );
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const web3 = useWeb3();

  // user info
  const [stakeAmount, setStakeAmount] = useState(new BigNumber(0));
  const [userStakedTokenBalance, setUserStakedTokenBalance] = useState(
    new BigNumber(0)
  );
  const [userStakedTokenAllowance, setUserStakedTokenAllowance] = useState(
    new BigNumber(0)
  );
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [withdrawableAmount, setWithdrawableAmount] = useState(
    new BigNumber(0)
  );
  const [userEligibleStakedAmount, setUserEligibleStakedAmount] = useState(
    new BigNumber(0)
  );
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  // button loading status
  const [claimLoading, setClaimLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false); // also applies to enabling

  const stakedTokenAddress =
    constants.CONTRACT_TOKEN_ADDRESS[stakedToken].address;
  const rewardTokenAddress =
    constants.CONTRACT_TOKEN_ADDRESS[rewardToken].address;

  const xvsVaultContract = useXvsVaultProxy();
  const stakedTokenContract = getTokenContractByAddress(
    web3,
    stakedTokenAddress
  );

  useEffect(async () => {
    let isMounted = true;
    let [balance, allowance, withdrawals] = ['0', '0', []];
    if (account) {
      [balance, allowance, withdrawals] = await Promise.all([
        stakedTokenContract.methods.balanceOf(account).call(),
        stakedTokenContract.methods
          .allowance(account, xvsVaultContract.options.address)
          .call(),
        xvsVaultContract.methods
          .getWithdrawalRequests(rewardTokenAddress, poolId.toNumber(), account)
          .call()
      ]);
    }
    // finish loading
    setLoading(false);

    if (isMounted) {
      setUserStakedTokenBalance(new BigNumber(balance));
      setUserStakedTokenAllowance(new BigNumber(allowance));

      const pendingWithdrawalsTemp = withdrawals.map(withdrawal => ({
        amount: new BigNumber(withdrawal.amount),
        lockedUntil: new BigNumber(withdrawal.lockedUntil),
        eligible: false
      }));

      // the amount of all the eligible withdrawals,
      // let's just calculated locally to avoid more network requests
      setWithdrawableAmount(
        withdrawals.reduce((target, widthdrawal, i) => {
          if (
            new BigNumber(widthdrawal.lockedUntil)
              .multipliedBy(1000)
              .lt(Date.now())
          ) {
            // we assign the eligible check result for later usage
            // eslint-disable-next-line no-param-reassign
            pendingWithdrawalsTemp[i].eligible = true;
            return target.plus(new BigNumber(widthdrawal.amount));
          }
          return target;
        }, new BigNumber(0))
      );

      setPendingWithdrawals(pendingWithdrawalsTemp);

      // the amount of all the withdrawals user requested, eligible or not
      const pendWithdrawalTotalTemp = pendingWithdrawalsTemp.reduce(
        (target, widthdrawal) => {
          return target.plus(widthdrawal.amount);
        },
        new BigNumber(0)
      );

      // pending withdrawals should not be accounted into staked amount
      setUserEligibleStakedAmount(
        userStakedAmount.minus(pendWithdrawalTotalTemp)
      );
    }
    return () => {
      isMounted = false;
    };
  }, [fastRefresh, account, userStakedAmount]);

  if (loading) {
    return (
      <CardContentWrapper>
        <LoadingSpinner className="loading-spinner" />;
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
              <div className="card-title">Available Rewards</div>
              <div className="center-amount">
                {pendingReward
                  .div(rewardTokenDecimal)
                  .dp(6, 1)
                  .toString(10)}{' '}
                {rewardToken.toUpperCase()}
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
                      .send({ from: account });
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
            stakedTokenAddress={stakedTokenAddress}
            rewardToken={rewardToken}
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
                    value={
                      stakeAmount.isZero() ? '0' : stakeAmount.toString(10)
                    }
                    onValueChange={values => {
                      const value = new BigNumber(values.value || 0);
                      const maxValue = userStakedTokenBalance
                        .div(stakedTokenDecimal)
                        .dp(4, 1);
                      setStakeAmount(value.gt(maxValue) ? maxValue : value);
                    }}
                    thousandSeparator
                    allowNegative={false}
                    placeholder="0"
                  />
                  <span
                    className="pointer max"
                    onClick={() => {
                      setStakeAmount(
                        userStakedTokenBalance.div(stakedTokenDecimal)
                      );
                    }}
                  >
                    MAX
                  </span>
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
                            new BigNumber(2)
                              .pow(256)
                              .minus(1)
                              .toString(10)
                          )
                          .send({
                            from: account
                          });
                      } else {
                        await xvsVaultContract.methods
                          .deposit(
                            rewardTokenAddress,
                            poolId.toNumber(),
                            stakeAmount.multipliedBy(1e18).toString(10)
                          )
                          .send({ from: account });
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

CardContent.propTypes = {
  poolId: PropTypes.instanceOf(BigNumber).isRequired,
  stakedToken: PropTypes.string.isRequired,
  rewardToken: PropTypes.string.isRequired,
  userStakedAmount: PropTypes.instanceOf(BigNumber).isRequired,
  pendingReward: PropTypes.instanceOf(BigNumber).isRequired,
  lockPeriodSecond: PropTypes.instanceOf(BigNumber).isRequired
};

export default CardContent;
