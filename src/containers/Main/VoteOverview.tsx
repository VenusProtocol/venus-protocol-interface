/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useCallback, ReactChildren } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { compose } from 'recompose';
import { bindActionCreators, Dispatch } from 'redux';
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

const VOTE_DISPLAY_ROWS = 4;

interface Props {
  match: { params?: { id?: string } },
  getProposalById: () => void,
  getVoters: () => void,
  children: React.ReactChild | ReactChildren
}

function VoteOverview({ getVoters, getProposalById, match }: Props) {
  const [proposalInfo, setProposalInfo] = useState({});
  const [agreeVotes, setAgreeVotes] = useState({
    sumVotes: 0,
    result: [],
  });
  const [againstVotes, setAgainstVotes] = useState({
    sumVotes: 0,
    result: [],
  });
  const [abstainVotes, setAbstainVotes] = useState({
    sumVotes: 0,
    result: [],
  });
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
    if (proposalInfo.id) {
      const threshold = await governorBravoContract.methods
        .proposalThreshold()
        .call();
      setProposalThreshold(+Web3.utils.fromWei(threshold, 'ether'));
      const weight = await xvsTokenContract.methods
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'proposer' does not exist on type '{}'.
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
        id: match.params.id,
      }).then((res) => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        setProposalInfo(res.data);
      });
    }
  }, [match, getProposalById]);

  const loadVotes = async ({ limit, filter, offset }: $TSFixMe) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
    if (proposalInfo.id) {
      await promisify(getVoters, {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
        id: proposalInfo.id,
        limit,
        filter,
        offset,
      })
        .then((res) => {
          // support: 0=against, 1=for, 2=abstain
          // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
          const { sumVotes, result, total } = res.data;
          switch (filter) {
            case 0: {
              setAgainstVotes({
                sumVotes: sumVotes.against,
                result,
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ sumVotes: any; result: any; to... Remove this comment to see the full error message
                total,
              });
              break;
            }
            case 1: {
              setAgreeVotes({
                sumVotes: sumVotes.for,
                result,
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ sumVotes: any; result: any; to... Remove this comment to see the full error message
                total,
              });
              break;
            }
            case 2: {
              setAbstainVotes({
                sumVotes: sumVotes.abstain,
                result,
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ sumVotes: any; result: any; to... Remove this comment to see the full error message
                total,
              });
              break;
            }
            default: {
              break;
            }
          }
        })
        .catch((e) => {
          console.log('>> error getting voters', e);
        });
    }
  };

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '() => Promise<void>' is not assi... Remove this comment to see the full error message
  useEffect(async () => {
    await loadVotes({ limit: VOTE_DISPLAY_ROWS, filter: 0 });
    await loadVotes({ limit: VOTE_DISPLAY_ROWS, filter: 1 });
    await loadVotes({ limit: VOTE_DISPLAY_ROWS, filter: 2 });
  }, [getVoters, proposalInfo]);

  const getIsPossibleExcuted = async () => {
    const proposalsRes = await governorBravoContract.methods
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
      .proposals(proposalInfo.id)
      .call();
    setIsPossibleExcuted(proposalsRes && proposalsRes.eta <= Date.now() / 1000);
    setExcuteEta(moment(proposalsRes.eta * 1000).format('LLLL'));
  };

  useEffect(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
    if (proposalInfo.id) {
      getIsPossibleExcuted();
    }
  }, [proposalInfo]);

  const handleUpdateProposal = async (statusType: $TSFixMe) => {
    if (statusType === 'Queue') {
      setIsLoading(true);
      try {
        await governorBravoContract.methods
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
          .queue(proposalInfo.id)
          .send({ from: account });
        setStatus('success');
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        toast.success({
          title: 'Proposal list will be updated within a few seconds',
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
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
          .execute(proposalInfo.id)
          .send({ from: account });
        setStatus('success');
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        toast.success({
          title: 'Proposal list will be updated within a few seconds',
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
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{}'.
          .cancel(proposalInfo.id)
          .send({ from: account });
        setCancelStatus('success');
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        toast.success({
          title: 'Current proposal is cancelled successfully. Proposal list will be updated within a few seconds',
        });
      } catch (error) {
        setCancelStatus('failure');
        console.log('queue error :>> ', error);
      }
    }
  };

  const totalVotes = new BigNumber(agreeVotes.sumVotes || 0)
    .plus(new BigNumber(againstVotes.sumVotes || 0))
    .plus(new BigNumber(abstainVotes.sumVotes || 0));

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
                { label: 'Abstain', votes: abstainVotes, filterType: 2 },
              ].map((data, i) => {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'total' does not exist on type '{ sumVote... Remove this comment to see the full error message
                const { sumVotes, result, total } = data.votes;
                return (
                  <Column key={i} xs="12" md="12" lg="4">
                    <VoteCard
                      type={data.filterType}
                      label={data.label}
                      voteNumber={new BigNumber(sumVotes)}
                      totalNumber={totalVotes}
                      addressNumber={total}
                      emptyNumber={VOTE_DISPLAY_ROWS - total}
                      list={result.map(v => ({
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'address' does not exist on type 'never'.
                        label: v.address,
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'votes' does not exist on type 'never'.
                        value: v.votes,
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'reason' does not exist on type 'never'.
                        reason: v.reason,
                      }))}
                      onViewAll={() => loadVotes({ filter: data.filterType })}
                    />
                  </Column>
                );
              })}
            </Row>
            <div className="vote-status-update">
              {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'. */}
              {proposalInfo.state !== 'Executed'
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'.
                && proposalInfo.state !== 'Defeated'
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'.
                && proposalInfo.state !== 'Canceled' && (
                  <div className="flex align-center just-center update-proposal-status">
                    <Button
                      className="cancel-btn"
                      disabled={
                        !account
                        || isCancelLoading
                        || proposerVotingWeight >= proposalThreshold
                        || cancelStatus === 'success'
                      }
                      onClick={() => handleUpdateProposal('Cancel')}
                    >
                      {isCancelLoading && <Icon type="loading" />}
                      {' '}
                      {cancelStatus === 'pending' || cancelStatus === 'failure'
                        ? 'Cancel'
                        : 'Cancelled'}
                    </Button>
                    {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'. */}
                    {proposalInfo.state === 'Succeeded' && (
                      <Button
                        className="queue-btn"
                        disabled={!account || isLoading || status === 'success'}
                        onClick={() => handleUpdateProposal('Queue')}
                      >
                        {isLoading && <Icon type="loading" />}
                        {' '}
                        {status === 'pending' || status === 'failure'
                          ? 'Queue'
                          : 'Queued'}
                      </Button>
                    )}
                    {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'. */}
                    {proposalInfo.state === 'Queued' && (
                      <Button
                        className="execute-btn"
                        disabled={
                          !account
                          || isLoading
                          || status === 'success'
                          || !isPossibleExcuted
                        }
                        onClick={() => handleUpdateProposal('Execute')}
                      >
                        {isLoading && <Icon type="loading" />}
                        {' '}
                        {status === 'pending' || status === 'failure'
                          ? 'Execute'
                          : 'Executed'}
                      </Button>
                    )}
                    {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'. */}
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
              {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'. */}
              {proposalInfo.state !== 'Executed'
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'.
                && proposalInfo.state !== 'Defeated'
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type '{}'.
                && proposalInfo.state !== 'Canceled'
                && proposerVotingWeight >= proposalThreshold && (
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

VoteOverview.defaultProps = {
  match: {},
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getProposalById, getVoters } = accountActionCreators;

  return bindActionCreators(
    {
      getProposalById,
      getVoters,
    },
    dispatch,
  );
};

export default compose<Props, Props>(
  withRouter,
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: any) => { getProposal... Remove this comment to see the full error message
  connectAccount(mapDispatchToProps),
)(VoteOverview);
