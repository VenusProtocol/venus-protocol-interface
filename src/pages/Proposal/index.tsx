/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'translation';
import proposals from '__mocks__/models/proposals';
import VoteSummary from './VoteSummary';
import ProposalSummary from './ProposalSummary';
import { Description } from './Description';
import { useStyles } from './styles';

interface ProposalUiProps {
  proposal: IProposal | undefined;
  forVoters: IVoter;
  againstVoters: IVoter;
  abstainVoters: IVoter;
  vote: (params: UseVoteParams) => Promise<TransactionReceipt>;
  votingEnabled: boolean;
  readableVoteWeight: string;
  isVoteLoading: boolean;
}

export const ProposalUi: React.FC<ProposalUiProps> = ({
  proposal,
  forVoters,
  againstVoters,
  abstainVoters,
  vote,
  votingEnabled,
  readableVoteWeight,
  isVoteLoading,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <div css={styles.root}>
      <ProposalSummary css={styles.summary} proposal={proposals[0]} />
      <div css={styles.votes}>
        <VoteSummary
          css={styles.vote}
          label={t('vote.for')}
          votedValueWei={new BigNumber('10000000000000')}
          votedTotalWei={new BigNumber('200000000000000')}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.successColor}
        />
        <VoteSummary
          css={[styles.vote, styles.middleVote]}
          label={t('vote.against')}
          votedValueWei={new BigNumber('1000000000000')}
          votedTotalWei={new BigNumber('2000000000000')}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.againstColor}
        />
        <VoteSummary
          css={styles.vote}
          label={t('vote.abstain')}
          votedValueWei={new BigNumber('10000000000000')}
          votedTotalWei={new BigNumber('20000000000000')}
          votesFrom={[]}
          onClick={() => {}}
          progressBarColor={styles.abstainColor}
        />
      </div>

      <Description description={proposal.description} actions={proposal.actions} />

      {voteModalType !== undefined && (
        <VoteModal
          voteModalType={voteModalType}
          handleClose={() => setVoteModalType(undefined)}
          vote={async (voteReason?: string) =>
            vote({ proposalId: proposal.id, voteType: voteModalType, voteReason })
          }
          readableVoteWeight={readableVoteWeight}
          isVoteLoading={isVoteLoading}
        />
      )}
    </div>
  );
};

const Proposal = () => {
  const { account } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const accountAddress = account?.address;
  const { data: proposal } = useGetProposal({ id }, { enabled: !!id });

  const { data: votingWeightWei = new BigNumber(0) } = useGetCurrentVotes(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const readableVoteWeight = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: votingWeightWei,
        tokenId: 'xvs',
        returnInReadableFormat: true,
        addSymbol: false,
      }),
    [votingWeightWei],
  );

  const defaultValue = {
    result: [],
    sumVotes: {
      for: new BigNumber(0),
      against: new BigNumber(0),
      abstain: new BigNumber(0),
      total: new BigNumber(0),
    },
  };
  const { data: againstVoters = defaultValue } = useGetVoters(
    { id: id || '', filter: 0 },
    { enabled: !!id },
  );
  const { data: forVoters = defaultValue } = useGetVoters(
    { id: id || '', filter: 1 },
    { enabled: !!id },
  );
  const { data: abstainVoters = defaultValue } = useGetVoters(
    { id: id || '', filter: 2 },
    { enabled: !!id },
  );

  const { vote, isLoading } = useVote({ accountAddress: account?.address || '' });
  const { data: userVoteReceipt } = useGetVoteReceipt(
    { proposalId: parseInt(id, 10), accountAddress },
    { enabled: !!accountAddress },
  );

  const votingEnabled =
    !!accountAddress &&
    proposal?.state === 'Active' &&
    userVoteReceipt?.voteSupport === 'NOT_VOTED' &&
    votingWeightWei.isGreaterThan(0);

  return (
    <ProposalUi
      proposal={proposal}
      forVoters={forVoters}
      againstVoters={againstVoters}
      abstainVoters={abstainVoters}
      vote={vote}
      votingEnabled={votingEnabled}
      readableVoteWeight={readableVoteWeight}
      isVoteLoading={isLoading}
    />
  );
};

export default Proposal;
