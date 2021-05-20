import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { Steps, Icon } from 'antd';
import { Card } from 'components/Basic/Card';

const ProposalHistoryWrapper = styled.div`
  width: 100%;
  background: var(--color-bg-active);
  border-radius: 20px;
  padding: 38px 20px;

  .title {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  .history-steps-wrapper {
    width: 100%;
    margin-top: 28px;
    .ant-steps {
      .ant-steps-item-tail {
        display: none !important;
      }
      .ant-steps-item-container {
        display: flex;
        .ant-steps-item-title {
          font-size: 17px;
          font-weight: 900;
          line-height: unset;
          color: var(--color-text-main);
        }
        .ant-steps-item-description {
          font-size: 16px;
          color: var(--color-text-secondary);
        }
        .ant-steps-item-icon {
          width: 22px;
          height: 22px;
          background: var(--color-dark-green);
          .ant-steps-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            line-height: unset;
            font-size: 16px;
          }
        }
      }
      .ant-steps-item-process .ant-steps-item-icon {
        background: var(--color-text-inactive);
        border: none;
      }
      .ant-steps-item-wait .ant-steps-item-icon {
        background: var(--color-text-inactive);
        border: none;
      }
      .ant-steps-item-error {
        .ant-steps-item-icon {
          background: var(--color-red);
          i {
            margin-left: -1px;
          }
        }
      }
    }
  }
`;

const { Step } = Steps;

// Pending,
// Active,
// Canceled,
// Defeated,
// Succeeded,
// Queued,
// Expired,
// Executed

const STATUSES = ['Pending', 'Active', 'Succeeded', 'Queued', 'Executed'];

function ProposalHistory({ proposalInfo }) {
  const getStepNumber = () => {
    if (proposalInfo.state === 'Defeated' || proposalInfo.state === 'Canceled')
      return 2;
    return STATUSES.findIndex(s => s === proposalInfo.state);
  };

  return (
    <Card>
      <ProposalHistoryWrapper>
        <p className="title">Proposal history</p>
        <div className="history-steps-wrapper">
          <Steps
            direction="vertical"
            current={getStepNumber()}
            status={
              proposalInfo.state === 'Canceled' ||
              proposalInfo.state === 'Defeated'
                ? 'error'
                : 'finish'
            }
          >
            <Step
              title="Created"
              description={
                proposalInfo.createdTimestamp
                  ? moment(proposalInfo.createdTimestamp * 1000).format('LLL')
                  : ''
              }
              icon={
                <Icon
                  type="check"
                  style={{ fontSize: '10px', color: 'white' }}
                />
              }
              disabled
            />
            <Step
              title="Active"
              description={
                proposalInfo.startTimestamp
                  ? moment(proposalInfo.startTimestamp * 1000).format('LLL')
                  : ''
              }
              icon={
                <Icon
                  type="check"
                  style={{ fontSize: '10px', color: 'white' }}
                />
              }
              disabled
            />
            <Step
              title={
                proposalInfo.state === 'Canceled' ||
                proposalInfo.state === 'Defeated'
                  ? `${
                      proposalInfo.state === 'Defeated' ? 'Failed' : 'Canceled'
                    }`
                  : `${
                      proposalInfo.state === 'Succeeded'
                        ? 'Succeeded'
                        : 'Succeed'
                    }`
              }
              description={
                proposalInfo.endTimestamp
                  ? moment(proposalInfo.endTimestamp * 1000).format('LLL')
                  : `${
                      proposalInfo.cancelTimestamp
                        ? moment(proposalInfo.cancelTimestamp * 1000).format(
                            'LLL'
                          )
                        : ''
                    }`
              }
              icon={
                <Icon
                  type={
                    proposalInfo.state === 'Canceled' ||
                    proposalInfo.state === 'Defeated'
                      ? 'close'
                      : 'check'
                  }
                  style={{ fontSize: '10px', color: 'white' }}
                />
              }
              disabled
            />
            {proposalInfo.state !== 'Defeated' &&
              proposalInfo.state !== 'Canceled' && (
                <Step
                  title={`${
                    proposalInfo.state === 'Queued' ? 'Queued' : 'Queue'
                  }`}
                  description={
                    proposalInfo.queuedTimestamp
                      ? moment(proposalInfo.queuedTimestamp * 1000).format(
                          'LLL'
                        )
                      : ''
                  }
                  icon={
                    <Icon
                      type="check"
                      style={{ fontSize: '10px', color: 'white' }}
                    />
                  }
                  disabled
                />
              )}
            {proposalInfo.state !== 'Defeated' &&
              proposalInfo.state !== 'Canceled' && (
                <Step
                  title={
                    proposalInfo.state === 'Expired'
                      ? proposalInfo.state
                      : `${
                          proposalInfo.state === 'Executed'
                            ? 'Executed'
                            : 'Execute'
                        }`
                  }
                  description={
                    proposalInfo.executedTimestamp
                      ? moment(proposalInfo.executedTimestamp * 1000).format(
                          'LLL'
                        )
                      : ''
                  }
                  icon={
                    <Icon
                      type="check"
                      style={{ fontSize: '10px', color: 'white' }}
                    />
                  }
                  disabled
                />
              )}
          </Steps>
        </div>
      </ProposalHistoryWrapper>
    </Card>
  );
}

ProposalHistory.propTypes = {
  proposalInfo: PropTypes.object
};
ProposalHistory.defaultProps = {
  proposalInfo: {}
};
export default ProposalHistory;
