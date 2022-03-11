import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { Icon } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import moment from 'moment';
import { Proposal as ProposalObject } from 'types';
import { Row, Column } from './Style';

const VotingWrapper = styled.div`
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-bg-active);
  .description {
    display: flex;
    align-items: center;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
    }
  }

  .agree {
    color: var(--color-dark-green);
  }
  .against {
    color: var(--color-purple);
  }

  .title {
    margin-bottom: 10px;
    * {
      width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 20px;
      font-weight: 900;
      color: var(--color-text-main);
    }
  }

  .title-progress {
    width: 300px;
    padding: 0 50px;
    .status-bar {
      height: 5px;
      border-radius: 27px;
      margin-top: 19px;
      background-color: var(--color-bg-primary);
      &:not(:last-child) {
        margin-bottom: 5px;
      }
    }
    .agree {
      background: var(--color-dark-green);
    }
    .against {
      background: var(--color-purple);
    }
  }

  .detail {
    .detail-content {
      font-size: 16px;
      color: var(--color-text-secondary);
      margin-right: 10px;

      .proposal-id,
      .proposal-state {
        margin-right: 10px;
      }
    }

    .orange-text {
      font-size: 16px;
      font-weight: bold;
      color: var(--color-orange);
    }
    .Passed-btn {
      color: var(--color-dark-green);
    }
    .Active-btn {
      color: var(--color-yellow);
    }
    .Succeeded-btn,
    .Queued-btn {
      color: var(--color-blue);
    }
    .Failed-btn {
      color: #f3f3f3;
    }
  }

  i {
    font-size: 28px;
  }

  span {
    margin-left: 70px;
    margin-right: 45px;
    font-size: 20px;
    font-weight: 900;
    color: var(--color-text-main);
  }
`;

interface Props extends RouteComponentProps {
  proposal: ProposalObject;
  support: boolean;
}

function Voting({ proposal, support, history }: Props) {
  const [forPercent, setForPercent] = useState(0);
  const [againstPercent, setAgainstPercent] = useState(0);

  useEffect(() => {
    const total = new BigNumber(proposal.forVotes).plus(new BigNumber(proposal.againstVotes));
    setForPercent(
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      new BigNumber(proposal.forVotes * 100).div(total).isNaN()
        ? '0'
        : new BigNumber(proposal.forVotes * 100).div(total).toString(),
    );
    setAgainstPercent(
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      new BigNumber(proposal.againstVotes * 100).div(total).isNaN()
        ? '0'
        : new BigNumber(proposal.againstVotes * 100).div(total).toString(),
    );
  }, [proposal]);

  const getStatus = (p: $TSFixMe) => {
    if (p.state === 'Executed') {
      return 'Passed';
    }
    if (p.state === 'Active') {
      return 'Active';
    }
    if (p.state === 'Defeated') {
      return 'Failed';
    }
    return p.state;
  };

  return (
    <VotingWrapper
      className="flex align-center pointer"
      onClick={() => history.push(`/vote/proposal/${proposal.id}`)}
    >
      <Row className="description">
        <Column xs="12" sm="8">
          <Row>
            <Column xs="12" sm="8">
              <div className="flex flex-column proposal-info ">
                <div className="title">
                  <ReactMarkdown source={proposal.description.split('\n')[0]} />
                </div>
                <div className="flex detail">
                  <div className="flex detail-content">
                    <p className="proposal-id">{proposal.id}</p>
                    <p className="proposal-state">{proposal.state}</p>
                    <p className="proposal-updatedAt">
                      {moment(proposal.createdAt).format('MMMM Do, YYYY')}
                    </p>
                  </div>
                  <div className={`orange-text ${getStatus(proposal)}-btn`}>
                    {getStatus(proposal)}
                  </div>
                </div>
              </div>
            </Column>
            <Column xs="12" sm="4">
              <div className="flex flex-column just-center title-progress">
                <div
                  className="status-bar agree"
                  style={{
                    width: `${forPercent}%`,
                  }}
                />
                <div
                  className="status-bar against"
                  style={{
                    width: `${againstPercent}%`,
                  }}
                />
              </div>
            </Column>
          </Row>
        </Column>
        <Column xs="12" sm="4">
          <div className="flex align-center just-center">
            <Icon className={support ? 'agree' : 'against'} type="check-circle" theme="filled" />
            <span>{support ? 'For' : 'Against'}</span>
          </div>
        </Column>
      </Row>
    </VotingWrapper>
  );
}

Voting.defaultProps = {
  support: false,
};

export default withRouter(Voting);
