import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import NumberFormat from 'react-number-format';
import * as constants from '../../utilities/constants';
import { useXvsVault } from '../../hooks/useContract';
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

  // button related
  const [claimable, setClaimable] = useState(false);
  const [stakable, setStakable] = useState(false);

  // loading
  const [loading, setLoading] = useState(true);

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
      // set button related statues
      setClaimable(pendingReward.gt(0) && account);
    }
    return () => {
      isMounted = false;
    };
  }, [fastRefresh, account]);

  if (loading) {
    return <LoadingSpinner />;
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
                  {userStakedTokenBalance.div(stakedTokenDecimal).toFixed(6)}
                </div>
                <div className="input-wrapper">
                  <NumberFormat
                    autoFocus
                    value={
                      stakeAmount.isZero() ? '0' : stakeAmount.toString(10)
                    }
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
                  className={`button stake-button ${
                    stakable ? '' : 'disabled'
                  }`}
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
  poolId: PropTypes.instanceOf(BigNumber),
  stakedToken: PropTypes.string,
  rewardToken: PropTypes.string,
  userStakedAmount: PropTypes.instanceOf(BigNumber),
  pendingReward: PropTypes.instanceOf(BigNumber),
  lockPeriodSecond: PropTypes.instanceOf(BigNumber)
};

CardContent.defaultProps = {
  poolId: new BigNumber(0),
  stakedToken: '',
  rewardToken: '',
  userStakedAmount: new BigNumber(0),
  pendingReward: new BigNumber(0),
  lockPeriodSecond: new BigNumber(0)
};

export default CardContent;
