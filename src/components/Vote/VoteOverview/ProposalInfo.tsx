import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
import moment from 'moment';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Markdown from 'react-remarkable';
import { Card } from 'components/Basic/Card';
import { getRemainingTime, FORMAT_STRING } from '../../../utilities/time';

const ProposalInfoWrapper = styled.div`
  width: 100%;
  p {
    font-weight: bold;
    font-size: 16px;
    color: var(--color-text-secondary);
  }
  .title {
    font-size: 20px;
    font-weight: 900;
    color: var(--color-text-main);
    margin-bottom: 21px;
  }
  .description {
    font-size: 17.5px;
    font-weight: 900;
    color: var(--color-text-main);
    margin-bottom: 13px;
    * {
      font-style: normal;
      font-weight: 600;
      font-size: 22px;
      color: var(--color-text-main);
    }
  }
  .proposal-status {
    .status {
      font-weight: bold;
      font-size: 16px;
      color: #8e8e8e;
      margin-left: 58px;
    }
    .Passed {
      color: var(--color-dark-green);
    }
    .Active {
      color: var(--color-yellow);
    }
    .Succeeded,
    .Queued {
      color: var(--color-blue);
    }
    .Failed {
      color: #f3f3f3;
    }
    .left-time {
      font-weight: bold;
      font-size: 16px;
      color: var(--color-text-secondary);
      margin-left: 58px;
    }
  }
`;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
function ProposalInfo({ proposalInfo }: $TSFixMe) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  const getStatus = (proposal: $TSFixMe) => {
    if (proposal.state === 'Executed') {
      return 'Passed';
    }
    if (proposal.state === 'Active') {
      return 'Active';
    }
    if (proposal.state === 'Defeated') {
      return 'Failed';
    }
    return proposal.state;
  };

  return (
    <Card>
      <ProposalInfoWrapper>
        <p className="title">Governance</p>
        {proposalInfo.description && (
          <div className="description">
            <Markdown source={proposalInfo.description.split('\n')[0]} />
          </div>
        )}
        <div className="flex align-center just-start proposal-status">
          <p>
            {`${proposalInfo.id} ${getStatus(proposalInfo)} ${moment(
              proposalInfo.updatedAt
            ).format(FORMAT_STRING)}`}
          </p>
          <div
            className={`flex align-center just-center status ${getStatus(
              proposalInfo
            )}`}
          >
            {getStatus(proposalInfo)}
          </div>
          <div className="left-time">{getRemainingTime(proposalInfo)}</div>
        </div>
      </ProposalInfoWrapper>
    </Card>
  );
}

ProposalInfo.propTypes = {
  proposalInfo: PropTypes.object
};
ProposalInfo.defaultProps = {
  proposalInfo: {}
};
export default ProposalInfo;
