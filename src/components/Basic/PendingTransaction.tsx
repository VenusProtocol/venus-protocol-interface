import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reco... Remove this comment to see the full error message
import { compose } from 'recompose';
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

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
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

PendingTransaction.propTypes = {
  settings: PropTypes.object.isRequired
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
const mapStateToProps = ({ account }: $TSFixMe) => ({
  settings: account.setting
});

// @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
export default compose(connectAccount(mapStateToProps, undefined))(
  PendingTransaction
);
