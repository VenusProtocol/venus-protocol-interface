import React, { useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import NumberFormat from 'react-number-format';
import { useVaiToken, useVaiVault } from '../../hooks/useContract';
import { CardItemWrapper } from './styles';

const VaiCardContentWrapper = styled.div`
  color: #fff;
  padding: 16px 40px 0 24px;
`;

function VaiCardContent({
  userPendingReward,
  userVaiBalance,
  userVaiAllowance,
  userVaiStakedAmount
}) {
  const { account } = useWeb3React();
  const vaiTokenContract = useVaiToken();
  const vaiVaultContract = useVaiVault();

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
      await vaiVaultContract.methods.claim().send({ from: account });
    } catch (error) {
      console.log('>> claim error: ', error);
    }
    setIsClaimLoading(false);
  };

  //
  const handleStakeVAI = async () => {
    setIsStakeLoading(true);
    try {
      vaiVaultContract.methods
        .deposit(
          stakeAmount
            .multipliedBy(1e18)
            .integerValue()
            .toString(10)
        )
        .send({ from: account });
      setStakeAmount(new BigNumber(0));
    } catch (error) {
      console.log('>> vai stake error: ', error);
    }
    setIsStakeLoading(false);
  };

  // approve users' XVS to VAI staking contract
  const handleApprove = async () => {
    setIsStakeLoading(true);
    try {
      await vaiTokenContract.methods
        .approve(
          vaiVaultContract.options.address,
          new BigNumber(2)
            .pow(256)
            .minus(1)
            .toString(10)
        )
        .send({ from: account });
    } catch (error) {
      console.log('>> vai token approve: ', error);
    }
    setIsStakeLoading(false);
  };

  /**
   * Withdraw VAI
   */
  const handleWithdrawVAI = async () => {
    setIsWithdrawLoading(true);
    try {
      await vaiVaultContract.methods
        .withdraw(
          withdrawAmount
            .multipliedBy(1e18)
            .integerValue()
            .toString(10)
        )
        .send({ from: account });
      setWithdrawAmount(new BigNumber(0));
    } catch (error) {
      console.log('>> vai withdraw error: ', error);
    }
    setIsWithdrawLoading(false);
  };

  return (
    <VaiCardContentWrapper>
      <Row justify="end" type="flex">
        {/* claim area */}
        <Col lg={{ span: 6 }} xs={{ span: 24 }}>
          <CardItemWrapper>
            <div className="card-item claim-rewards">
              <div className="card-title">Available Rewards</div>
              <div className="center-amount">
                {userPendingReward
                  .div(1e18)
                  .dp(6, 1)
                  .toString(10)}{' '}
                XVS
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
                    VAI Staked:{' '}
                    {userVaiStakedAmount
                      .div(1e18)
                      .dp(4, 1)
                      .toString(10)}
                  </span>
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
                        const value = new BigNumber(values.value || 0);
                        const maxValue = userVaiStakedAmount.div(1e18).dp(4, 1);
                        setWithdrawAmount(
                          value.gt(maxValue) ? maxValue : value
                        );
                      }}
                      thousandSeparator
                      allowNegative={false}
                      placeholder="0"
                    />
                    <span
                      className="pointer max"
                      onClick={() => {
                        setWithdrawAmount(userVaiStakedAmount.div(1e18));
                      }}
                    >
                      MAX
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="button claim-button"
                  disabled={
                    !withdrawAmount.gt(0) ||
                    !userVaiStakedAmount.gt(0) ||
                    !account
                  }
                  onClick={() => {
                    handleWithdrawVAI();
                  }}
                >
                  {isWithdrawLoading && <Icon type="loading" />} Withdraw
                </button>
              </div>
            </div>
          </CardItemWrapper>
        </Col>

        {/* stake area */}
        <Col lg={{ span: 7 }} xs={{ span: 24 }}>
          <CardItemWrapper>
            <div className="card-item stake">
              <div className="withdraw-request">
                <div className="card-title">
                  Available VAI to stake:{' '}
                  {userVaiBalance
                    .div(1e18)
                    .dp(4, 1)
                    .toString(10)}
                </div>
                <div className="input-wrapper">
                  <NumberFormat
                    autoFocus
                    value={
                      stakeAmount.isZero() ? '0' : stakeAmount.toString(10)
                    }
                    onValueChange={values => {
                      const value = new BigNumber(values.value || 0);
                      const maxValue = userVaiBalance.div(1e18).dp(4, 1);
                      setStakeAmount(value.gt(maxValue) ? maxValue : value);
                    }}
                    thousandSeparator
                    allowNegative={false}
                    placeholder="0"
                  />
                  <span
                    className="pointer max"
                    onClick={() => {
                      setStakeAmount(userVaiBalance.div(1e18));
                    }}
                  >
                    MAX
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!stakeAmount.gt(0) || !account}
                  className="button stake-button"
                  onClick={() => {
                    if (userVaiAllowance.gt(0)) {
                      handleStakeVAI();
                    } else {
                      handleApprove();
                    }
                  }}
                >
                  {isStakeLoading && <Icon type="loading" />}
                  {userVaiAllowance.gt(0) ? 'Stake' : 'Enable'}
                </button>
              </div>
            </div>
          </CardItemWrapper>
        </Col>
      </Row>
    </VaiCardContentWrapper>
  );
}

VaiCardContent.propTypes = {
  userPendingReward: PropTypes.instanceOf(BigNumber).isRequired,
  userVaiBalance: PropTypes.instanceOf(BigNumber).isRequired,
  userVaiAllowance: PropTypes.instanceOf(BigNumber).isRequired,
  userVaiStakedAmount: PropTypes.instanceOf(BigNumber).isRequired
};

export default VaiCardContent;
