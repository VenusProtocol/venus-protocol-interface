import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Icon, Modal, Input } from 'antd';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import dashImg from 'assets/img/dash.png';
import closeImg from 'assets/img/close.png';
import { Row, Column } from 'components/Basic/Style';
import { Label } from './Label';
import { useGovernorBravo } from '../../hooks/useContract';

const ProposalWrapper = styled.div`
  width: 100%;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-bg-active);

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
  .detail {
    display: flex;
    align-items: center;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
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

  .description {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
  }

  .vote-status {
    padding: 10px;
    img {
      width: 29px;
      height: 29px;
      border-radius: 50%;
      margin-right: 40px;
    }

    @media only screen and (max-width: 768px) {
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 40px;
      }
    }
  }

  .vote-actions {
    margin-top: 10px;
    button {
      height: 32px;
      border-radius: 5px;
      background-image: linear-gradient(to right, #f2c265, #f7b44f);
      .MuiButton-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--color-text-main);
        text-transform: capitalize;
      }
      &:not(:last-child) {
        margin-right: 5px;
      }
    }
  }
`;

const ModalContentWrapper = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);
  color: #fff;

  .close-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 24px;
  }

  .header {
    text-align: center;
    width: 100%;
    border-bottom: 1px solid var(--color-bg-active);
    padding: 24px;

    .title {
      font-size: 24px;
      line-height: 24px;
      color: var(--color-text-main);
    }
  }

  .input-wrapper {
    width: 100%;
    padding: 24px;
    .input-caption {
      cursor: pointer;
      font-size: 16px;
      line-height: 32px;
      margin: 8px 0;
    }
  }

  .confirm-button {
    text-align: center;
    min-width: 200px;
    background: #ebbf6e;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    line-height: 16px;
    padding: 8px;
    margin-bottom: 12px;
  }

  button:disabled {
    background: #d3d3d3;
    cursor: not-allowed;
  }
`;

const VOTE_TYPE = {
  AGAINST: 0,
  FOR: 1,
  ABSTAIN: 2
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

function Proposal({ address, proposal, votingWeight, history }) {
  const [isLoading, setIsLoading] = useState(false);
  const [voteType, setVoteType] = useState(VOTE_TYPE.FOR);
  const [voteStatus, setVoteStatus] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [voteReason, setVoteReason] = useState('');
  const governorBravoContract = useGovernorBravo();

  const getStatus = p => {
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

  const getIsHasVoted = useCallback(async () => {
    const res = await governorBravoContract.methods
      .getReceipt(proposal.id, address)
      .call();
    setVoteStatus(res.hasVoted ? 'voted' : 'novoted');
  }, [address, proposal]);

  useEffect(() => {
    if (address && proposal.id) {
      getIsHasVoted();
    }
  }, [address, proposal, getIsHasVoted]);

  const handleOpenVoteConfirmModal = type => {
    setVoteType(type);
    setConfirmModalVisible(true);
  };

  const handleVote = async () => {
    setIsLoading(true);
    try {
      if (voteReason) {
        await governorBravoContract.methods
          .castVoteWithReason(proposal.id, voteType, voteReason)
          .send({ from: address });
      } else {
        await governorBravoContract.methods
          .castVote(proposal.id, voteType)
          .send({ from: address });
      }
    } catch (error) {
      console.log('cast vote error :>> ', error);
    }
    setIsLoading(false);
    setConfirmModalVisible(false);
  };

  const getTitle = descs => {
    const index = descs.findIndex(d => d !== '');
    if (index !== -1) {
      return descs[index];
    }
    return '';
  };

  const goToProposal = () => {
    history.push(`/vote/proposal/${proposal.id}`);
  };

  return (
    <ProposalWrapper className="flex flex-column pointer">
      <div className="title" onClick={goToProposal}>
        <ReactMarkdown source={getTitle(proposal.description.split('\n'))} />
      </div>
      <Row className="detail" onClick={goToProposal}>
        <Column xs="12" sm="9">
          <Row>
            <Column xs="12" sm="7" className="description">
              <Label size="16">{proposal.id}</Label>
              <Label size="16">{proposal.state}</Label>
              <Label size="16">
                {moment(proposal.createdAt).format('MMMM Do, YYYY')}
              </Label>
            </Column>
            <Column xs="12" sm="5" className="description">
              <div className={`orange-text ${getStatus(proposal)}-btn`}>
                {getStatus(proposal)}
              </div>
              <Label size="16">{getRemainTime(proposal)}</Label>
            </Column>
          </Row>
        </Column>
        <Column xs="12" sm="3" className="vote-status">
          {voteStatus &&
            voteStatus === 'novoted' &&
            proposal.state !== 'Active' && (
              <div className="flex align-center">
                <img src={dashImg} alt="dash" />
                <p className="orange-text">NO VOTE</p>
              </div>
            )}
          {voteStatus && voteStatus === 'voted' && (
            <div className="flex align-center">
              <p className="orange-text">VOTED</p>
            </div>
          )}
        </Column>
      </Row>
      <Row className="vote-actions">
        {voteStatus && voteStatus === 'novoted' && proposal.state === 'Active' && (
          <div className="flex align-center" onClick={e => e.stopPropagation()}>
            {[0, 1, 2].map(type => {
              return (
                <Button
                  key={type}
                  className="vote-btn"
                  disabled={
                    votingWeight === '0' ||
                    !proposal ||
                    (proposal && proposal.state !== 'Active')
                  }
                  onClick={() => handleOpenVoteConfirmModal(type)}
                >
                  {isLoading && voteType === type && <Icon type="loading" />}{' '}
                  {['For', 'Against', 'Abstain'][type]}
                </Button>
              );
            })}
          </div>
        )}
      </Row>
      <Modal
        className="venus-modal"
        width={450}
        height={300}
        visible={confirmModalVisible}
        onCancel={() => {
          setConfirmModalVisible(false);
        }}
        footer={null}
        closable={false}
        maskClosable
        centered
      >
        <ModalContentWrapper className="flex flex-column align-center just-center">
          <img
            className="close-btn pointer"
            src={closeImg}
            alt="close"
            onClick={() => setConfirmModalVisible(false)}
          />
          <div className="header">
            <span className="title">
              Your vote: {['For', 'Against', 'Abstain'][voteType]}
            </span>
          </div>
          <div className="input-wrapper">
            <div className="input-caption">Why do you vote this option</div>
            <Input
              value={voteReason}
              placeholder="Enter your reason"
              onChange={e => setVoteReason(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="confirm-button"
            disabled={isLoading}
            onClick={() => handleVote()}
          >
            {isLoading && <Icon type="loading" />} Confirm
          </button>
        </ModalContentWrapper>
      </Modal>
    </ProposalWrapper>
  );
}

Proposal.propTypes = {
  address: PropTypes.string,
  votingWeight: PropTypes.string.isRequired,
  proposal: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string,
    state: PropTypes.string,
    forVotes: PropTypes.string,
    againstVotes: PropTypes.string,
    voted: PropTypes.bool,
    createdAt: PropTypes.string
  }),
  history: PropTypes.object
};

Proposal.defaultProps = {
  address: '',
  proposal: {},
  history: {}
};

export default compose(withRouter)(Proposal);
