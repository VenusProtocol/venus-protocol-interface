/* eslint-disable no-useless-escape */
import React from 'react';
import PropTypes from 'prop-types';
import { Progress, Icon } from 'antd';
import commaNumber from 'comma-number';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Card } from 'components/Basic/Card';

const HoldingWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: var(--color-bg-primary);
  padding: 27px 43px 39px;

  .title {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
    margin-bottom: 23px;
  }

  .holding-section {
    padding: 19px 0 30px;
    border-top: 1px solid var(--color-bg-active);

    .label {
      font-size: 16px;
      font-weight: normal;
      color: var(--color-text-secondary);
    }

    .value {
      font-size: 20px;
      font-weight: 900;
      color: var(--color-text-main);
    }

    .voting-count {
      font-size: 16px;
      font-weight: normal;
      color: var(--color-text-secondary);

      span {
        margin: 0 20px 0;
      }
    }
  }

  .ant-progress-inner {
    background-color: var(--color-bg-primary);
  }
`;
const format = commaNumber.bindWith(',', '.');

function Holding({ address, holdingInfo }) {
  return (
    <Card>
      <HoldingWrapper className="flex flex-column">
        <div className="title">Holding</div>
        <div className="flex flex-column holding-section">
          <div className="label">Venus Balance</div>
          <div className="value">{format(holdingInfo.balance || '0.0000')}</div>
        </div>
        <div className="flex flex-column holding-section">
          <div className="flex align-center just-between">
            <div className="label">Votes</div>
            <div className="flex align-center voting-count">
              <Icon type="user" />
              <span>{holdingInfo.delegateCount || 0}</span>
            </div>
          </div>
          <div className="value">{format(holdingInfo.votes || '0.0000')}</div>
          <Progress
            percent={100}
            strokeColor="#d99d43"
            strokeWidth={7}
            showInfo={false}
          />
        </div>
        <div className="flex flex-column holding-section">
          <div className="label">Delegating To</div>
          <div className="value">
            {holdingInfo.delegates !==
              '0x0000000000000000000000000000000000000000' &&
            holdingInfo.delegates !== address.toLowerCase()
              ? 'Delegated'
              : 'Undelegated'}
          </div>
        </div>
      </HoldingWrapper>
    </Card>
  );
}

Holding.propTypes = {
  address: PropTypes.string,
  holdingInfo: PropTypes.object
};

Holding.defaultProps = {
  address: '',
  holdingInfo: {}
};

export default compose(withRouter)(Holding);
