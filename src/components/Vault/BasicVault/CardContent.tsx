import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';

import { commaFormat } from 'utilities/common';
import { TokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import { CardItemWrapper } from '../styles';

const CardContentWrapper = styled.div`
  color: #fff;
  padding: 16px 40px 0 24px;
`;

interface CardContentProps {
  userPendingReward: BigNumber;
  userStakedTokenBalance: BigNumber;
  userStakedAllowance: BigNumber;
  userStakedAmount: BigNumber;
  stakedToken: Uppercase<TokenId>;
  rewardToken: Uppercase<TokenId>;
  onClaimReward: () => Promise<void>;
  onStake: (amt: BigNumber) => Promise<void>;
  onApprove: (amt: BigNumber) => Promise<void>;
  onWithdraw: (amt: BigNumber) => Promise<void>;
  fullWithdraw?: boolean;
}

function CardContent({
  userPendingReward,
  userStakedTokenBalance,
  userStakedAllowance,
  userStakedAmount,
  stakedToken,
  rewardToken,
  onClaimReward,
  onStake,
  onApprove,
  onWithdraw,
  fullWithdraw,
}: CardContentProps) {
  const { account } = useContext(AuthContext);

  // user info
  const [stakeAmount, setStakeAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  // loading statuses
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isStakeLoading, setIsStakeLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  //
  const handleClaimReward = async () => {
    setIsClaimLoading(true);
    try {
      await onClaimReward();
    } catch (error) {
      console.log('>> claim error: ', error);
    }
    setIsClaimLoading(false);
  };

  //
  const handleStake = async () => {
    setIsStakeLoading(true);
    try {
      await onStake(stakeAmount.multipliedBy(1e18));
      setStakeAmount(new BigNumber(0));
    } catch (error) {
      console.log('>> stake error: ', error);
    }
    setIsStakeLoading(false);
  };

  // approve
  const handleApprove = async () => {
    setIsStakeLoading(true);
    try {
      await onApprove(new BigNumber(2).pow(256).minus(1));
    } catch (error) {
      console.log('>> token approve: ', error);
    }
    setIsStakeLoading(false);
  };

  /**
   * Withdraw VAI
   */
  const handleWithdraw = async () => {
    setIsWithdrawLoading(true);
    try {
      await onWithdraw(withdrawAmount.multipliedBy(1e18));
      setWithdrawAmount(new BigNumber(0));
    } catch (error) {
      console.log('>> withdraw error: ', error);
    }
    setIsWithdrawLoading(false);
  };

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
                  {userPendingReward.div(1e18).dp(6, 1).toString(10)} {rewardToken}
                </div>
              </div>
              <button
                type="button"
                className="button claim-button"
                disabled={!account || !userPendingReward.gt(0)}
                onClick={() => {
                  handleClaimReward();
                }}
              >
                {isClaimLoading && <Icon type="loading" />} Claim
              </button>
            </div>
          </CardItemWrapper>
        </Col>

        {/* withdraw area */}
        <Col lg={{ span: 7 }} xs={{ span: 24 }}>
          <CardItemWrapper>
            <div className="card-item request-withdraw">
              <div className="left">
                <div className="card-title">
                  <span>
                    {stakedToken} Staked: {userStakedAmount.div(1e18).dp(4, 1).toString(10)}
                  </span>
                </div>
                <div className="card-body">
                  {fullWithdraw ? null : (
                    <div className="input-wrapper">
                      <NumberFormat
                        autoFocus
                        value={withdrawAmount.isZero() ? '0' : withdrawAmount.toString(10)}
                        onValueChange={values => {
                          const value = new BigNumber(values.value || 0);
                          const maxValue = userStakedAmount.div(1e18).dp(4, 1);
                          setWithdrawAmount(value.gt(maxValue) ? maxValue : value);
                        }}
                        thousandSeparator
                        allowNegative={false}
                        placeholder="0"
                      />
                      <span
                        className="pointer max"
                        onClick={() => {
                          setWithdrawAmount(userStakedAmount.div(1e18));
                        }}
                      >
                        MAX
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="button claim-button"
                disabled={
                  (!fullWithdraw && !withdrawAmount.gt(0)) || !userStakedAmount.gt(0) || !account
                }
                onClick={() => {
                  handleWithdraw();
                }}
              >
                {isWithdrawLoading && <Icon type="loading" />} Withdraw
              </button>
            </div>
          </CardItemWrapper>
        </Col>

        {/* stake area */}
        <Col lg={{ span: 7 }} xs={{ span: 24 }}>
          <CardItemWrapper>
            <div className="card-item stake">
              <div className="withdraw-request">
                <div className="card-title">
                  Available {stakedToken} to stake:{' '}
                  {commaFormat(userStakedTokenBalance.div(1e18).dp(4, 1).toString(10))}
                </div>
                <div className="input-wrapper">
                  <NumberFormat
                    autoFocus
                    value={stakeAmount.isZero() ? '0' : stakeAmount.toString(10)}
                    onValueChange={values => {
                      const value = new BigNumber(values.value || 0);
                      const maxValue = userStakedTokenBalance.div(1e18).dp(4, 1);
                      setStakeAmount(value.gt(maxValue) ? maxValue : value);
                    }}
                    thousandSeparator
                    allowNegative={false}
                    placeholder="0"
                  />
                  <span
                    className="pointer max"
                    onClick={() => {
                      setStakeAmount(userStakedTokenBalance.div(1e18));
                    }}
                  >
                    MAX
                  </span>
                </div>
              </div>
              <button
                type="button"
                disabled={!stakeAmount.gt(0) || !account}
                className="button stake-button"
                onClick={() => {
                  if (userStakedAllowance.gt(0)) {
                    handleStake();
                  } else {
                    handleApprove();
                  }
                }}
              >
                {isStakeLoading && <Icon type="loading" />}
                {userStakedAllowance.gt(0) ? 'Stake' : 'Enable'}
              </button>
            </div>
          </CardItemWrapper>
        </Col>
      </Row>
    </CardContentWrapper>
  );
}

export default CardContent;
