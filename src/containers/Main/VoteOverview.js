/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { withRouter } from 'react-router-dom';
import { Icon, Tooltip } from 'antd';
import Button from '@material-ui/core/Button';
import { connectAccount, accountActionCreators } from 'core';
import MainLayout from 'containers/Layout/MainLayout';
import ProposalInfo from 'components/Vote/VoteOverview/ProposalInfo';
import ProposalUser from 'components/Vote/VoteOverview/ProposalUser';
import VoteCard from 'components/Vote/VoteOverview/VoteCard';
import ProposalDetail from 'components/Vote/VoteOverview/ProposalDetail';
import ProposalHistory from 'components/Vote/VoteOverview/ProposalHistory';
import { promisify } from 'utilities';
import toast from 'components/Basic/Toast';
import { Row, Column } from 'components/Basic/Style';
import { useWeb3React } from '@web3-react/core';
import { useToken, useGovernorBravo } from '../../hooks/useContract';

const VoteOverviewWrapper = styled.div`
  width: 100%;

  .vote-status-update {
    margin-bottom: 20px;
    button {
      width: 120px;
      height: 40px;
      background-image: linear-gradient(to right, #f2c265, #f7b44f);
      border-radius: 10px;
      .MuiButton-label {
        font-size: 16px;
        font-weight: bold;
        color: var(--color-text-main);
        text-transform: capitalize;
      }
      &:not(:last-child) {
        margin-right: 10px;
      }
    }

    .warning {
      color: var(--color-orange);
      margin: 20px 0px;
    }

    i {
      color: var(--color-yellow);
    }
  }

  .column-1 {
    flex: 3;
    margin-right: 19px;
    .section-1 {
      margin-bottom: 25px;
      .proposal-info {
        flex: 1;
        margin-right: 19px;
      }
      .proposal-user {
        flex: 1;
        margin-left: 19px;
      }
    }
    .section-2 {
      margin-bottom: 35px;
      .agree-section {
        flex: 1;
        margin-right: 19px;
      }
      .against-section {
        flex: 1;
        margin-left: 19px;
      }
    }
  }
  .column-2 {
    flex: 1;
    margin-left: 19px;
  }
`;

function VoteOverview({ getVoters, getProposalById, match }) {
  const [proposalInfo, setProposalInfo] = useState({});
  const [agreeVotes, setAgreeVotes] = useState({});
  const [againstVotes, setAgainstVotes] = useState({});
  const [abstainVotes, setAbstainVotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const [cancelStatus, setCancelStatus] = useState('pending');
  const [proposalThreshold, setProposalThreshold] = useState(0);
  const [proposerVotingWeight, setProposerVotingWeight] = useState(0);
  const [isPossibleExcuted, setIsPossibleExcuted] = useState(false);
  const [excuteEta, setExcuteEta] = useState('');
  const { account } = useWeb3React();
  const xvsTokenContract = useToken('xvs');
  const governorBravoContract = useGovernorBravo();

  const updateBalance = useCallback(async () => {
    if (proposalInfo.id) {
      const threshold = await governorBravoContract.methods
        .proposalThreshold()
        .call();
      setProposalThreshold(+Web3.utils.fromWei(threshold, 'ether'));
      const weight = await xvsTokenContract.methods
        .getCurrentVotes(proposalInfo.proposer)
        .call();
      setProposerVotingWeight(+Web3.utils.fromWei(weight, 'ether'));
    }
  }, [proposalInfo]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  useEffect(() => {
    if (match.params && match.params.id) {
      promisify(getProposalById, {
        id: match.params.id
      }).then(res => {
        setProposalInfo(res.data);
      });
    }
  }, [match, getProposalById]);

  const loadVotes = useCallback(
    async limit => {
      if (proposalInfo.id) {
        await promisify(getVoters, {
          id: proposalInfo.id,
          limit
        })
          .then(res => {
            // support:  0=against, 1=for, 2=abstain
            const voters = res.data;
            setAgainstVotes({
              sumVotes: voters.against || '0',
              result: voters.result.filter(item => item.support === 0)
            });
            setAgreeVotes({
              sumVotes: voters.for || '0',
              result: voters.result.filter(item => item.support === 1)
            });
            setAbstainVotes({
              sumVotes: voters.abstain || '0',
              result: voters.result.filter(item => item.support === 2)
            });
          })
          .catch(e => {
            console.log(`>> error getting voters`, e);
          });
      }
    },
    [getVoters, proposalInfo]
  );

  const getIsPossibleExcuted = async () => {
    const proposalsRes = await governorBravoContract.methods
      .proposals(proposalInfo.id)
      .call();
    setIsPossibleExcuted(proposalsRes && proposalsRes.eta <= Date.now() / 1000);
    setExcuteEta(moment(proposalsRes.eta * 1000).format('LLLL'));
  };

  useEffect(() => {
    loadVotes(4);
  }, [loadVotes]);

  useEffect(() => {
    if (proposalInfo.id) {
      getIsPossibleExcuted();
    }
  }, [proposalInfo]);

  const loadMore = filter => {
    // By getting rid of limit we can retrieve all the votes
    promisify(getVoters, {
      id: proposalInfo.id,
      filter
    }).then(res => {
      switch (filter) {
        case 0: {
          setAgainstVotes(res.data || {});
          break;
        }
        case 1: {
          setAgreeVotes(res.data || {});
          break;
        }
        case 2: {
          setAbstainVotes(res.data || {});
          break;
        }
        default: {
          break;
        }
      }
    });
  };

  const handleUpdateProposal = async statusType => {
    if (statusType === 'Queue') {
      setIsLoading(true);
      try {
        await governorBravoContract.methods
          .queue(proposalInfo.id)
          .send({ from: account });
        setStatus('success');
        toast.success({
          title: `Proposal list will be updated within a few seconds`
        });
      } catch (error) {
        setStatus('failure');
        console.log('queue error :>> ', error);
      }
      setIsLoading(false);
    } else if (statusType === 'Execute') {
      setIsLoading(true);
      try {
        await governorBravoContract.methods
          .execute(proposalInfo.id)
          .send({ from: account });
        setStatus('success');
        toast.success({
          title: `Proposal list will be updated within a few seconds`
        });
      } catch (error) {
        setStatus('failure');
        console.log('queue error :>> ', error);
      }
      setIsLoading(false);
    } else if (statusType === 'Cancel') {
      setIsCancelLoading(true);
      try {
        await governorBravoContract.methods
          .cancel(proposalInfo.id)
          .send({ from: account });
        setCancelStatus('success');
        toast.success({
          title: `Current proposal is cancelled successfully. Proposal list will be updated within a few seconds`
        });
      } catch (error) {
        setCancelStatus('failure');
        console.log('queue error :>> ', error);
      }
    }
  };

  const totalVotes = new BigNumber(agreeVotes.sumVotes || '0')
    .plus(new BigNumber(againstVotes.sumVotes || '0'))
    .plus(new BigNumber(abstainVotes.sumVotes || '0'));

  return (
    <MainLayout title="Overview">
      <VoteOverviewWrapper className="flex">
        <Row>
          <Column xs="12" sm="9">
            <Row>
              <Column xs="12" sm="6">
                <ProposalInfo proposalInfo={proposalInfo} />
              </Column>
              <Column xs="12" sm="6">
                <ProposalUser proposalInfo={proposalInfo} />
              </Column>
            </Row>
            <Row>
              {[
                { label: 'For', votes: agreeVotes, filterType: 1 },
                { label: 'Against', votes: againstVotes, filterType: 0 },
                { label: 'Abstain', votes: abstainVotes, filterType: 2 }
              ].map((data, i) => {
                return (
                  <Column key={i} xs="12" md="12" lg="4">
                    <VoteCard
                      type={data.filterType}
                      label={data.label}
                      voteNumber={new BigNumber(data.votes.sumVotes)}
                      totalNumber={totalVotes}
                      addressNumber={
                        new BigNumber(data.votes.total).isNaN()
                          ? 0
                          : data.votes.total
                      }
                      emptyNumber={
                        4 -
                        (new BigNumber(data.votes.total).isNaN()
                          ? 0
                          : data.votes.total)
                      }
                      list={
                        data.votes.result &&
                        data.votes.result.map(v => ({
                          label: v.address,
                          value: v.votes,
                          reason: v.reason
                        }))
                      }
                      onViewAll={() => loadMore(data.filterType)}
                    />
                  </Column>
                );
              })}
            </Row>
            <div className="vote-status-update">
              {proposalInfo.state !== 'Executed' &&
                proposalInfo.state !== 'Defeated' &&
                proposalInfo.state !== 'Canceled' && (
                  <div className="flex align-center just-center update-proposal-status">
                    <Button
                      className="cancel-btn"
                      disabled={
                        !account ||
                        isCancelLoading ||
                        proposerVotingWeight >= proposalThreshold ||
                        cancelStatus === 'success'
                      }
                      onClick={() => handleUpdateProposal('Cancel')}
                    >
                      {isCancelLoading && <Icon type="loading" />}{' '}
                      {cancelStatus === 'pending' || cancelStatus === 'failure'
                        ? 'Cancel'
                        : 'Cancelled'}
                    </Button>
                    {proposalInfo.state === 'Succeeded' && (
                      <Button
                        className="queue-btn"
                        disabled={!account || isLoading || status === 'success'}
                        onClick={() => handleUpdateProposal('Queue')}
                      >
                        {isLoading && <Icon type="loading" />}{' '}
                        {status === 'pending' || status === 'failure'
                          ? 'Queue'
                          : 'Queued'}
                      </Button>
                    )}
                    {proposalInfo.state === 'Queued' && (
                      <Button
                        className="execute-btn"
                        disabled={
                          !account ||
                          isLoading ||
                          status === 'success' ||
                          !isPossibleExcuted
                        }
                        onClick={() => handleUpdateProposal('Execute')}
                      >
                        {isLoading && <Icon type="loading" />}{' '}
                        {status === 'pending' || status === 'failure'
                          ? 'Execute'
                          : 'Executed'}
                      </Button>
                    )}
                    {proposalInfo.state === 'Queued' && !isPossibleExcuted && (
                      <Tooltip title={`You are able to excute at ${excuteEta}`}>
                        <Icon
                          className="pointer"
                          type="info-circle"
                          theme="filled"
                        />
                      </Tooltip>
                    )}
                  </div>
                )}
              {proposalInfo.state !== 'Executed' &&
                proposalInfo.state !== 'Defeated' &&
                proposalInfo.state !== 'Canceled' &&
                proposerVotingWeight >= proposalThreshold && (
                  <p className="center warning">
                    You can&apos;t cancel the proposal while the proposer voting
                    weight meets proposal threshold
                  </p>
                )}
            </div>
            <Row>
              <Column xs="12">
                <ProposalDetail proposalInfo={proposalInfo} />
              </Column>
            </Row>
          </Column>
          <Column xs="12" sm="3">
            <ProposalHistory proposalInfo={proposalInfo} />
          </Column>
        </Row>
      </VoteOverviewWrapper>
    </MainLayout>
  );
}

VoteOverview.propTypes = {
  match: PropTypes.object,
  settings: PropTypes.object,
  getProposalById: PropTypes.func.isRequired,
  getVoters: PropTypes.func.isRequired
};

VoteOverview.defaultProps = {
  match: {},
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getProposalById, getVoters } = accountActionCreators;

  return bindActionCreators(
    {
      getProposalById,
      getVoters
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(VoteOverview);
