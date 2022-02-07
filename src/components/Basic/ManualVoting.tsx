import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Icon } from 'antd';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';

const ManualVotingWrapper = styled.div`
  width: 100%;

  .header-content {
    font-size: 24.5px;
    font-weight: normal;
    color: var(--color-text-main);
    margin-bottom: 38px;
  }

  .manual-voting-section {
    width: 100%;
    border-top: 1px solid var(--color-bg-active);
    padding: 43px 0;

    .voting-count {
      color: var(--color-text-main);
      font-size: 29.5px;
      font-weight: bold;
    }

    .voting-address {
      margin-top: 36px;
      color: var(--color-text-main);
      font-size: 17px;
      font-weight: 500;
    }

    .voting-spinner {
      margin-top: 63px;
      color: #f2c265;
    }

    .voting-confirm {
      margin-top: 65px;
      color: var(--color-text-secondary);
      font-size: 13.5px;
      font-weight: normal;
    }
  }
`;

function ManualVoting({ address, balance, isLoading }: $TSFixMe) {
  const antIcon = <Icon type="loading" style={{ fontSize: 64 }} spin />;

  return (
    <ManualVotingWrapper>
      <div className="flex align-center just-center header-content">
        <p>Confirm Transaction</p>
      </div>
      <div className="flex flex-column align-center just-center manual-voting-section">
        <p className="voting-count">
          {balance}
          {' '}
          Votes
        </p>
        <span className="voting-address">
          Manual Voting from
          {' '}
          {`${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`}
        </span>
        {isLoading && <Spin className="voting-spinner" indicator={antIcon} />}
        <span className="voting-confirm">Confirm the transaction.</span>
      </div>
    </ManualVotingWrapper>
  );
}

ManualVoting.propTypes = {
  address: PropTypes.bool.isRequired,
  balance: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ManualVoting;
