import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import NumberFormat from 'react-number-format';
import * as constants from '../../utilities/constants';
import { useXvsVault, useToken } from '../../hooks/useContract';
import useRefresh from '../../hooks/useRefresh';
import useWeb3 from '../../hooks/useWeb3';
import { getTokenContractByAddress } from '../../utilities/contractHelpers';
import WithdrawHistoryModal from './WithdrawHistoryModal';

const VaultCardContentWrapper = styled.div`
  color: #fff;
  padding: 16px 40px 0 24px;

  .center-amount {
    text-align: center;
    margin-top: 24px;
  }

  .card-title {
    display: flex;
    margin-bottom: 12px;
    justify-content: space-between;
    align-items: center;
    .icon {
      color: #aaa;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
  }

  .card-item {
    position: relative;
    background: #090e25;
    border-radius: 8px;
    height: 165px;
    margin-left: 16px;
    margin-bottom: 16px;
    padding: 16px;
  }

  .button {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 36px;
    background: #ebbf6e;
    text-align: center;
    cursor: pointer;

    &.disabled {
      background: #d3d3d3;
      cursor: not-allowed;
    }
  }

  .request-withdraw {
    display: flex;
    .left {
      flex: 1;
      position: relative;
      border-right: 1px solid #262b48;
      padding-right: 16px;
      .button {
        bottom: 0;
        left: 0;
        right: 16px;
      }
    }
    .right {
      position: relative;
      padding-left: 16px;
      width: 40%;
      .button {
        bottom: 0;
        left: 16px;
        right: 0;
      }
    }
  }

  .input-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    input {
      width: 80%;
      height: 31px;
      border: none;
      font-size: 24px;
      line-height: 31px;
      background: transparent;
      &:focus {
        outline: none;
      }
    }
    .max {
      font-size: 14px;
      line-height: 16px;
      color: #ebbf6e;
    }
  }
  .lock-period {
    font-size: 12px;
    line-height: 16px;
  }
`;

function formatTimeToLockPeriodString(seconds) {
  let remaining = 0;
  const days = Math.floor(seconds / 86400);
  remaining = seconds - days * 86400;
  const hours = Math.floor(remaining / 3600);
  remaining -= hours * 3600;
  const minutes = Math.floor(remaining / 60);
  remaining -= minutes * 60;
  const second = remaining;
  return `${days ? `${days} days ` : ''}${hours ? `${hours} hours ` : ''}${
    minutes ? `${minutes} minutes ` : ''
  }${second ? `${second} seconds` : ''}`;
}

function VaultCardContent({
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
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));
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

  // button related
  const [claimable, setClaimable] = useState(false);
  const [withdrawRequestable, setWithdrawRequestable] = useState(false);
  const [withdrawExecutable, setWithdrawExecutable] = useState(false);
  const [stakable, setStakable] = useState(false);

  const stakedTokenAddress =
    constants.CONTRACT_TOKEN_ADDRESS[stakedToken].address;
  const rewardTokenAddress =
    constants.CONTRACT_TOKEN_ADDRESS[rewardToken].address;

  const xvsVaultContract = useXvsVault();
  const stakedTokenContract = getTokenContractByAddress(
    web3,
    stakedTokenAddress
  );

  useEffect(() => {
    setStakable(userStakedTokenAllowance.gt(0) && account && stakeAmount.gt(0));
  }, [stakeAmount, userStakedTokenAllowance, account]);

  useEffect(() => {
    setWithdrawRequestable(
      userEligibleStakedAmount.gt(0) && withdrawAmount.gt(0) && account
    );
  }, [withdrawAmount, userStakedTokenAllowance, account]);

  useEffect(async () => {
    let isMounted = true;
    let [balance, allowance, withdrawals] = [
      new BigNumber(0),
      new BigNumber(0),
      []
    ];
    if (account) {
      [balance, allowance, withdrawals] = await Promise.all([
        stakedTokenContract.methods.balanceOf(account).call(),
        stakedTokenContract.methods
          .allowance(account, xvsVaultContract.options.address)
          .call(),
        xvsVaultContract.methods
          .getWithdrawalRequests(rewardTokenAddress, poolId, account)
          .call()
      ]);
    }
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
      // set button related statues
      setClaimable(pendingReward.gt(0) && account);
      setWithdrawExecutable(withdrawableAmount.gt(0) && account);
    }
    return () => {
      isMounted = false;
    };
  }, [fastRefresh, account]);

  return (
    <VaultCardContentWrapper>
      <Row justify="end" type="flex">
        {/* claim area */}
        <Col lg={{ span: 6 }} xs={{ span: 24 }}>
          <div className="card-item claim-rewards">
            <div className="card-title">Available Rewards</div>
            <div className="center-amount">
              {pendingReward.div(rewardTokenDecimal).toFixed(6)}{' '}
              {rewardToken.toUpperCase()}
            </div>
            <div
              className={`button claim-button ${claimable ? '' : 'disabled'}`}
              onClick={() => {
                if (claimable) {
                  xvsVaultContract.methods
                    .deposit(rewardTokenAddress, poolId, 0)
                    .send({ from: account });
                }
              }}
            >
              Claim
            </div>
          </div>
        </Col>

        {/* withdraw area */}
        <Col lg={{ span: 11 }} xs={{ span: 24 }}>
          <div className="card-item request-withdraw">
            <div className="left">
              <div className="card-title">
                <span>
                  {stakedToken.toUpperCase()} Staked:{' '}
                  {userEligibleStakedAmount.div(stakedTokenDecimal).toFixed(6)}
                </span>
                <Icon
                  type="history"
                  className="icon"
                  onClick={() => setHistoryModalVisible(!historyModalVisible)}
                />
              </div>
              <div className="card-body">
                <div className="input-wrapper">
                  <NumberFormat
                    autoFocus
                    value={
                      withdrawAmount.isZero()
                        ? '0'
                        : withdrawAmount.toString(10)
                    }
                    onValueChange={values => {
                      const { value } = values;
                      setWithdrawAmount(new BigNumber(value));
                    }}
                    isAllowed={({ value }) => {
                      return new BigNumber(value || 0)
                        .multipliedBy(stakedTokenDecimal)
                        .isLessThanOrEqualTo(userEligibleStakedAmount);
                    }}
                    thousandSeparator
                    allowNegative={false}
                    placeholder="0"
                  />
                  <span
                    className="pointer max"
                    onClick={() => {
                      setWithdrawAmount(
                        userEligibleStakedAmount.div(stakedTokenDecimal)
                      );
                    }}
                  >
                    MAX
                  </span>
                </div>
                <div className="lock-period">
                  Locking period:{' '}
                  {formatTimeToLockPeriodString(lockPeriodSecond)}
                </div>
              </div>
              <div
                className={`button claim-button ${
                  withdrawRequestable ? '' : 'disabled'
                }`}
                onClick={() => {
                  if (withdrawRequestable) {
                    xvsVaultContract.methods
                      .requestWithdrawal(
                        rewardTokenAddress,
                        poolId,
                        withdrawAmount.multipliedBy(stakedTokenDecimal)
                      )
                      .send({
                        from: account
                      });
                  }
                }}
              >
                Request Withdraw
              </div>
            </div>
            {/* !left */}
            <div className="right">
              <div className="card-title">Withdrawable amount</div>
              <div className="center-amount">
                {withdrawableAmount.div(stakedTokenDecimal).toFixed(6)}{' '}
                {stakedToken.toUpperCase()}
              </div>
              <div
                className={`button execute-withdraw-button ${
                  withdrawExecutable ? '' : 'disabled'
                }`}
                onClick={() => {
                  if (withdrawExecutable) {
                    xvsVaultContract.methods
                      .executeWithdrawal(rewardTokenAddress, poolId)
                      .send({ from: account });
                  }
                }}
              >
                Withdraw
              </div>
            </div>
          </div>
        </Col>

        {/* stake area */}
        <Col lg={{ span: 7 }} xs={{ span: 24 }}>
          <div className="card-item stake">
            <div className="withdraw-request">
              <div className="card-title">
                Available {stakedToken.toUpperCase()} to stake:{' '}
                {userStakedTokenBalance.div(stakedTokenDecimal).toFixed(6)}
              </div>
              <div className="input-wrapper">
                <NumberFormat
                  autoFocus
                  value={stakeAmount.isZero() ? '0' : stakeAmount.toString(10)}
                  onValueChange={values => {
                    const { value } = values;
                    setStakeAmount(new BigNumber(value));
                  }}
                  isAllowed={({ value }) => {
                    return new BigNumber(value || 0)
                      .multipliedBy(stakedTokenDecimal)
                      .isLessThanOrEqualTo(userStakedTokenBalance);
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
              <div
                className={`button stake-button ${stakable ? '' : 'disabled'}`}
                onClick={() => {
                  if (stakable) {
                    xvsVaultContract.methods
                      .deposit(
                        rewardTokenAddress,
                        poolId,
                        stakeAmount.multipliedBy(1e18).toString(10)
                      )
                      .send({ from: account });
                  }
                }}
              >
                {userStakedTokenAllowance.gt(0) ? 'Stake' : 'Enable'}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <WithdrawHistoryModal
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        pendingWithdrawals={pendingWithdrawals}
        withdrawableAmount={withdrawableAmount}
        stakedToken={stakedToken}
      />
    </VaultCardContentWrapper>
  );
}

VaultCardContent.propTypes = {
  poolId: PropTypes.instanceOf(BigNumber),
  stakedToken: PropTypes.string,
  rewardToken: PropTypes.string,
  userStakedAmount: PropTypes.instanceOf(BigNumber),
  pendingReward: PropTypes.instanceOf(BigNumber),
  lockPeriodSecond: PropTypes.instanceOf(BigNumber)
};

VaultCardContent.defaultProps = {
  poolId: new BigNumber(0),
  stakedToken: '',
  rewardToken: '',
  userStakedAmount: new BigNumber(0),
  pendingReward: new BigNumber(0),
  lockPeriodSecond: new BigNumber(0)
};

export default VaultCardContent;
