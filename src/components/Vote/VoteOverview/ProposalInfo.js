import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Markdown from 'react-remarkable';
import moment from 'moment';
import { Card } from 'components/Basic/Card';

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

function ProposalInfo({ proposalInfo }) {
  const getStatus = proposal => {
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

  const getRemainTime = item => {
    if (item.state === 'Active') {
      const diffBlock = item.endBlock - item.blockNumber;
      const duration = moment.duration(
        diffBlock < 0 ? 0 : diffBlock * 3,
        'seconds'
      );
      const days = Math.floor(duration.asDays());
      const hours = Math.floor(duration.asHours()) - days * 24;
      const minutes =
        Math.floor(duration.asMinutes()) - days * 24 * 60 - hours * 60;

      return `${
        days > 0 ? `${days} ${days > 1 ? 'days' : 'day'},` : ''
      } ${hours} ${hours > 1 ? 'hrs' : 'hr'} ${
        days === 0 ? `, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}` : ''
      } left`;
    }
    if (item.state === 'Pending') {
      return `${moment(item.createdTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    if (item.state === 'Active') {
      return `${moment(item.startTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    if (item.state === 'Canceled' || item.state === 'Defeated') {
      return `${moment(item.endTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    if (item.state === 'Queued') {
      return `${moment(item.queuedTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    if (item.state === 'Expired' || item.state === 'Executed') {
      return `${moment(item.executedTimestamp * 1000).format('MMMM DD, YYYY')}`;
    }
    return `${moment(item.updatedAt).format('MMMM DD, YYYY')}`;
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
            ).format('MMMM DD, YYYY')}`}
          </p>
          <div
            className={`flex align-center just-center status ${getStatus(
              proposalInfo
            )}`}
          >
            {getStatus(proposalInfo)}
          </div>
          <div className="left-time">{getRemainTime(proposalInfo)}</div>
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
