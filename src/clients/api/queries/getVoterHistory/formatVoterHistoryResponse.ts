import BigNumber from 'bignumber.js';
import { VoterHistory } from 'types';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';
import { IGetVoterHistoryResponse } from './types';

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
}: IGetVoterHistoryResponse['result'][number]['proposal']): VoterHistory => {
  const endDate = endTimestamp ? createDateFromSecondsTimestamp(endTimestamp) : undefined;

  let descriptionObj = { version: 'v1' as const, title: '', description: '' };
  try {
    descriptionObj = JSON.parse(description);
  } catch (err) {
    const [title, descriptionText] = description.split('\n')[0];
    descriptionObj = { version: 'v1' as const, title, description: descriptionText };
  }

  const abstainedVotesWei = new BigNumber(abstainedVotes || 0);
  const againstVotesWei = new BigNumber(againstVotes || 0);
  const forVotesWei = new BigNumber(forVotes || 0);

  return {
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
  };
};

const formatVoterHistoryResponse = (data: IGetVoterHistoryResponse) => ({
  limit: data.limit,
  offset: data.offset,
  total: data.total,
  voterHistory: data.result.map(d => ({
    address: d.address,
    blockNumber: d.blockNumber,
    blockTimestamp: d.blockTimestamp,
    createdAt: new Date(d.createdAt),
    id: d.id,
    proposal: formatToProposal(d.proposal),
    reason: d.reason ? d.reason : undefined,
    support: d.hasVoted ? indexedVotingSupportNames[d.support] : 'NOT_VOTED',
    updatedAt: new Date(d.updatedAt),
    votesWei: new BigNumber(d.votes),
  })),
});

export default formatVoterHistoryResponse;
