import BigNumber from 'bignumber.js';
import { AbstainVoter, AgainstVoter, ForVoter, Proposal, ProposalType, VoteSupport } from 'types';

import type { ProposalApiResponse } from 'clients/api';

import areAddressesEqual from './areAddressesEqual';

const createDateFromSecondsTimestamp = (timestampInSeconds: number): Date => {
  const inMilliseconds = timestampInSeconds * 1000;
  return new Date(inMilliseconds);
};

const formatToProposal = ({
  cancelTimestamp,
  createdTimestamp,
  description,
  endBlock,
  endTimestamp,
  executedTimestamp,
  proposer,
  queuedTimestamp,
  startTimestamp,
  state,
  createdTxHash,
  cancelTxHash,
  executedTxHash,
  queuedTxHash,
  proposalType,
  proposalId,
  proposalActions,
  votes,
  forVotesMantissa,
  abstainedVotesMantissa,
  againstVotesMantissa,
  accountAddress,
}: ProposalApiResponse & { accountAddress: string }): Proposal => {
  const endDate = endTimestamp ? createDateFromSecondsTimestamp(endTimestamp) : undefined;

  let descriptionObj: Proposal['description'] = {
    version: 'v2',
    title: '',
    description: '',
    forDescription: '',
    againstDescription: '',
    abstainDescription: '',
  };

  try {
    descriptionObj = JSON.parse(description);
  } catch (err) {
    // Split description in half, delimited by the first instance of a break
    // line symbol (\n). The first half corresponds to the title of the
    // proposal, the second to the description
    const [title, descriptionText] = description.split(/\n(.*)/s);

    // Remove markdown characters from title since it's rendered as plain text
    // on the front end
    const plainTitle = title.replaceAll('*', '').replaceAll('#', '');

    descriptionObj = { version: 'v1', title: plainTitle, description: descriptionText };
  }

  const allVotes = votes || [];
  const forVotes: ForVoter[] = [];
  const againstVotes: AgainstVoter[] = [];
  const abstainVotes: AbstainVoter[] = [];

  allVotes?.forEach(vote => {
    const enrichedVote = {
      ...vote,
      blockTimestamp: new Date(vote.blockTimestamp),
      votesMantissa: new BigNumber(vote.votesMantissa),
    };

    if (vote.support === VoteSupport.For) {
      forVotes.push(enrichedVote as ForVoter);
    } else if (vote.support === VoteSupport.Against) {
      againstVotes.push(enrichedVote as AgainstVoter);
    } else if (vote.support === VoteSupport.Abstain) {
      abstainVotes.push(enrichedVote as AbstainVoter);
    }
  });

  forVotes.sort((a, b) => b.votesMantissa.minus(a.votesMantissa).toNumber());
  againstVotes.sort((a, b) => b.votesMantissa.minus(a.votesMantissa).toNumber());
  abstainVotes.sort((a, b) => b.votesMantissa.minus(a.votesMantissa).toNumber());

  const abstainVotesValue = new BigNumber(abstainedVotesMantissa);
  const againstVotesValue = new BigNumber(againstVotesMantissa);
  const forVotesValue = new BigNumber(forVotesMantissa);

  const totalVotesMantissa = abstainVotesValue.plus(againstVotesValue).plus(forVotesValue);

  const userHasVoted = !!votes?.find(v => areAddressesEqual(v.address, accountAddress));

  const formattedActions = (proposalActions || [])
    .map(({ calldata, value, ...action }) => ({
      ...action,
      value: value || '',
      callData: calldata,
    }))
    .sort((a, b) => a.actionIndex - b.actionIndex);

  const proposal: Proposal = {
    abstainedVotesMantissa: abstainVotesValue,
    againstVotesMantissa: againstVotesValue,
    cancelDate: cancelTimestamp ? createDateFromSecondsTimestamp(cancelTimestamp) : undefined,
    createdDate: createdTimestamp ? createDateFromSecondsTimestamp(createdTimestamp) : undefined,
    description: descriptionObj,
    endBlock,
    endDate,
    executedDate: executedTimestamp ? createDateFromSecondsTimestamp(executedTimestamp) : undefined,
    forVotesMantissa: forVotesValue,
    proposalId,
    proposer,
    queuedDate: queuedTimestamp ? createDateFromSecondsTimestamp(queuedTimestamp) : undefined,
    startDate: createDateFromSecondsTimestamp(startTimestamp),
    state,
    createdTxHash: createdTxHash ?? undefined,
    cancelTxHash: cancelTxHash ?? undefined,
    executedTxHash: executedTxHash ?? undefined,
    queuedTxHash: queuedTxHash ?? undefined,
    totalVotesMantissa,
    proposalActions: formattedActions,
    forVotes,
    againstVotes,
    abstainVotes,
    proposalType: proposalType ?? ProposalType.NORMAL,
    userHasVoted,
  };

  return proposal;
};

export default formatToProposal;
