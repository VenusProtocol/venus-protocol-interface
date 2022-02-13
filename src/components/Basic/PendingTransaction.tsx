import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { connectAccount } from 'core';
import moment from 'moment';
import { Label } from './Label';

const PendingTransactionWrapper = styled.div`
  border-top: 1px solid var(--color-bg-active);
  .title {
    padding: 16px;
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-main);
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;

    .content-info {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .content-date {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    span {
      margin-left: 10px;
    }
  }
`;

function PendingTransaction({ settings }: $TSFixMe) {
  const [curTime, setCurTime] = useState('');
  useEffect(() => {
    const dateTime = new Date();
    setCurTime(moment(dateTime).format('LLL'));
  }, []);

  return (
    <PendingTransactionWrapper>
      <div className="title">Pending Transactions</div>
      <div className="content">
        <div className="content-info">
          <LoadingSpinner size={20} />
          <Label size="16" primary>
            {settings.pendingInfo.type}
          </Label>
          <Label size="16" primary>
            {settings.pendingInfo && settings.pendingInfo.amount}
          </Label>
          <Label size="16" primary>
            {settings.pendingInfo && settings.pendingInfo.symbol}
          </Label>
        </div>
        <div className="content-data">
          <Label size="14">{curTime}</Label>
        </div>
      </div>
    </PendingTransactionWrapper>
  );
}

const mapStateToProps = ({ account }: $TSFixMe) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(PendingTransaction);
