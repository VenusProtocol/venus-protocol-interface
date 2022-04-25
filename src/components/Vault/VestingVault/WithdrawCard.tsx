import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';

import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { AuthContext } from 'context/AuthContext';
import WithdrawHistoryModal from './WithdrawHistoryModal';
import { CardItemWrapper } from '../styles';

const WithdrawCardWrapper = styled.div`
  .card-item {
    padding: 0;
  }

  .request-withdraw {
    .left {
      position: relative;
      border-right: none;
      border-bottom: 1px solid #262b48;
      padding: 16px;
    }
    .right {
      position: relative;
      padding: 16px;
    }
    .column {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 165px;
    }
  }

  .lock-period {
    font-size: 12px;
    line-height: 16px;
  }

  @media only screen and (min-width: 992px) {
    .request-withdraw {
      .left {
        border-right: 1px solid #262b48;
        border-bottom: none;
      }
    }
  }
`;

function formatTimeToLockPeriodString(seconds: $TSFixMe) {
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

interface WithdrawCardProps {
  poolId: BigNumber;
  stakedToken: TokenId;
  rewardTokenAddress: string | undefined;
  lockPeriodSecond: BigNumber;
  withdrawableAmount: BigNumber;
  pendingWithdrawals: unknown[];
  userEligibleStakedAmount: BigNumber;
}

function WithdrawCard({
  poolId,
  stakedToken,
  rewardTokenAddress,
  lockPeriodSecond,
  withdrawableAmount,
  pendingWithdrawals,
  userEligibleStakedAmount,
}: WithdrawCardProps) {
  const stakedTokenDecimal = new BigNumber(10).pow(getToken(stakedToken).decimals);

  const { account } = useContext(AuthContext);
  const xvsVaultContract = useXvsVaultProxyContract();

  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  const [requestWithdrawLoading, setRequestWithdrawLoading] = useState(false);
  const [executeWithdrawLoading, setExecuteWithdrawLoading] = useState(false);

  return (
    <WithdrawCardWrapper>
      <CardItemWrapper>
        {/* withdraw area */}
        <div className="card-item request-withdraw">
          <Row type="flex">
            <Col xs={{ span: 24 }} lg={{ span: 15 }} className="left column">
              <div className="card-content">
                <div className="card-title">
                  <span>
                    {stakedToken.toUpperCase()} Staked:{' '}
                    {userEligibleStakedAmount.div(stakedTokenDecimal).toFixed(4)}
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
                      value={withdrawAmount.isZero() ? '0' : withdrawAmount.toString(10)}
                      onValueChange={values => {
                        const value = new BigNumber(values.value || 0);
                        const maxValue = userEligibleStakedAmount.div(stakedTokenDecimal).dp(4, 1);
                        setWithdrawAmount(value.gt(maxValue) ? maxValue : value);
                      }}
                      thousandSeparator
                      allowNegative={false}
                      placeholder="0"
                    />
                    <span
                      className="pointer max"
                      onClick={() => {
                        setWithdrawAmount(userEligibleStakedAmount.div(stakedTokenDecimal));
                      }}
                    >
                      MAX
                    </span>
                  </div>
                  <div className="lock-period">
                    Locking period: {formatTimeToLockPeriodString(lockPeriodSecond)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="button claim-button"
                disabled={
                  !userEligibleStakedAmount.gt(0) ||
                  !withdrawAmount.gt(0) ||
                  !account ||
                  requestWithdrawLoading
                }
                onClick={async () => {
                  setRequestWithdrawLoading(true);
                  try {
                    await xvsVaultContract.methods
                      .requestWithdrawal(
                        rewardTokenAddress!,
                        poolId.toNumber(),
                        withdrawAmount.multipliedBy(stakedTokenDecimal).toString(10),
                      )
                      .send({
                        from: account?.address,
                      });
                  } catch (e) {
                    console.log('>> request withdraw error: ', e);
                  }
                  setRequestWithdrawLoading(false);
                }}
              >
                {requestWithdrawLoading && <Icon type="loading" />} Request Withdraw
              </button>
            </Col>
            {/* !left */}
            <Col xs={{ span: 24 }} lg={{ span: 9 }} className="right column">
              <div className="card-content">
                <div className="card-title">Withdrawable amount</div>
                <div className="center-amount">
                  {withdrawableAmount.div(stakedTokenDecimal).toFixed(4)}{' '}
                  {stakedToken.toUpperCase()}
                </div>
              </div>
              <button
                type="button"
                className="button execute-withdraw-button"
                disabled={!withdrawableAmount.gt(0) || !account || executeWithdrawLoading}
                onClick={async () => {
                  setExecuteWithdrawLoading(true);
                  try {
                    await xvsVaultContract.methods
                      .executeWithdrawal(rewardTokenAddress!, poolId.toNumber())
                      .send({ from: account?.address });
                  } catch (e) {
                    console.log('>> execute withdraw error:', e);
                  }
                  setExecuteWithdrawLoading(false);
                }}
              >
                {executeWithdrawLoading && <Icon type="loading" />} Withdraw
              </button>
            </Col>
          </Row>
        </div>
        <WithdrawHistoryModal
          visible={historyModalVisible}
          onCancel={() => setHistoryModalVisible(false)}
          pendingWithdrawals={pendingWithdrawals}
          withdrawableAmount={withdrawableAmount}
          stakedToken={stakedToken}
        />
      </CardItemWrapper>
    </WithdrawCardWrapper>
  );
}

export default WithdrawCard;
