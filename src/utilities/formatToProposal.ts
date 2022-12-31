import BigNumber from 'bignumber.js';
import { Proposal, ProposalType } from 'types';

interface FormatToProposalInput {
  abstainedVotes: string;
  againstVotes: string;
  cancelTimestamp: number | null;
  createdTimestamp: number | null;
  description: string;
  endBlock: number;
  endTimestamp: number;
  executedTimestamp: number | null;
  forVotes: string;
  id: number;
  proposer: string;
  queuedTimestamp: number | null;
  startTimestamp: number;
  state:
    | 'Pending'
    | 'Active'
    | 'Canceled'
    | 'Defeated'
    | 'Succeeded'
    | 'Queued'
    | 'Expired'
    | 'Executed';
  createdTxHash: string | null;
  cancelTxHash: string | null;
  endTxHash: string | null;
  executedTxHash: string | null;
  queuedTxHash: string | null;
  startTxHash: string | null;
  actions?: {
    callData: string;
    signature: string;
    target: string;
    value: string;
  }[];
  proposalType?: ProposalType;
}

const createDateFromSecondsTimestamp = (timestampInSeconds: number): Date => {
  const inMilliseconds = timestampInSeconds * 1000;
  return new Date(inMilliseconds);
};

const formatToProposal = ({
  abstainedVotes,
  againstVotes,
  cancelTimestamp,
  createdTimestamp,
  description,
  endBlock,
  endTimestamp,
  executedTimestamp,
  forVotes,
  id,
  proposer,
  queuedTimestamp,
  startTimestamp,
  state,
  createdTxHash,
  cancelTxHash,
  endTxHash,
  executedTxHash,
  queuedTxHash,
  startTxHash,
  actions,
  proposalType,
}: FormatToProposalInput): Proposal => {
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

  const abstainedVotesWei = new BigNumber(abstainedVotes || 0);
  const againstVotesWei = new BigNumber(againstVotes || 0);
  const forVotesWei = new BigNumber(forVotes || 0);

  const proposal: Proposal = {
    abstainedVotesWei,
    againstVotesWei,
    cancelDate: cancelTimestamp ? createDateFromSecondsTimestamp(cancelTimestamp) : undefined,
    createdDate: createdTimestamp ? createDateFromSecondsTimestamp(createdTimestamp) : undefined,
    description: descriptionObj,
    endBlock,
    endDate,
    executedDate: executedTimestamp ? createDateFromSecondsTimestamp(executedTimestamp) : undefined,
    forVotesWei,
    id,
    proposer,
    queuedDate: queuedTimestamp ? createDateFromSecondsTimestamp(queuedTimestamp) : undefined,
    startDate: createDateFromSecondsTimestamp(startTimestamp),
    state,
    createdTxHash: createdTxHash ?? undefined,
    cancelTxHash: cancelTxHash ?? undefined,
    endTxHash: endTxHash ?? undefined,
    executedTxHash: executedTxHash ?? undefined,
    queuedTxHash: queuedTxHash ?? undefined,
    startTxHash: startTxHash ?? undefined,
    totalVotesWei: abstainedVotesWei.plus(againstVotesWei).plus(forVotesWei),
    actions: actions || [],
    proposalType: proposalType ?? ProposalType.NORMAL,
  };

  return proposal;
};

export default formatToProposal;
