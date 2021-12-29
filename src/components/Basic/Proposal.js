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
import { FORMAT_STRING, getRemainingTime } from '../../utilities/time';

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

  .description-item {
    margin-right: 4px;
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
    top: 16px;
    right: 16px;
    width: 16px;
  }

  .header {
    text-align: center;
    width: 100%;
    border-bottom: 1px solid var(--color-bg-active);
    padding: 16px;
    margin-bottom: 32px;

    .title {
      font-size: 16px;
      line-height: 24px;
      color: var(--color-text-main);
    }
  }

  .input-wrapper {
    width: 100%;
    padding: 12px;
    .input-caption {
      cursor: pointer;
      font-size: 14px;
      line-height: 21px;
      margin-bottom: 8px;
      color: var(--color-secondary);
      span {
        color: var(--color-gold);
      }
    }
  }

  .input-remaining {
    text-align: right;
    color: #a1a1a1;
    margin-top: 8px;
  }

  .confirm-button-wrapper {
    padding: 0 12px;
    width: 100%;
  }

  .confirm-button {
    text-align: center;
    background: var(--color-gold);
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

const MAX_INPUT_LENGTH = 1000;

const VOTE_TYPE = {
  AGAINST: 0,
  FOR: 1,
  ABSTAIN: 2
};

const getVoteTypeStringFromValue = type => {
  return [
    ['👎', 'Against'],
    ['👍', 'For'],
    ['🤔️', 'Abstain']
  ][type];
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
              <Label className="description-item" size="16">
                {proposal.id}
              </Label>
              <Label className="description-item" size="16">
                {proposal.state}
              </Label>
              <Label className="description-item" size="16">
                {moment(proposal.createdAt).format(FORMAT_STRING)}
              </Label>
            </Column>
            <Column xs="12" sm="5" className="description">
              <div
                className={`description-item orange-text ${getStatus(
                  proposal
                )}-btn`}
              >
                {getStatus(proposal)}
              </div>
              <Label size="16">{getRemainingTime(proposal)}</Label>
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
            {[VOTE_TYPE.FOR, VOTE_TYPE.AGAINST, VOTE_TYPE.ABSTAIN].map(type => {
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
                  {getVoteTypeStringFromValue(type)[1]}
                </Button>
              );
            })}
          </div>
        )}
      </Row>
      <Modal
        className="venus-modal"
        width={360}
        height={326}
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
              {getVoteTypeStringFromValue(voteType)[0]} I vote:{' '}
              {getVoteTypeStringFromValue(voteType)[1]}
            </span>
          </div>
          <div className="input-wrapper">
            <div className="input-caption">
              Why do you vote{' '}
              <span>{getVoteTypeStringFromValue(voteType)[1]}</span>
            </div>
            <Input.TextArea
              value={voteReason}
              placeholder="Enter your reason"
              onChange={e => setVoteReason(e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
            />
            <div className="input-remaining">
              {MAX_INPUT_LENGTH - voteReason.length}
            </div>
          </div>
          <div className="confirm-button-wrapper">
            <button
              type="button"
              className="confirm-button"
              disabled={isLoading || voteReason.length > MAX_INPUT_LENGTH}
              onClick={() => handleVote()}
            >
              {isLoading && <Icon type="loading" />} Confirm
            </button>
          </div>
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
