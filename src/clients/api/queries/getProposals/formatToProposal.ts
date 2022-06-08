import BigNumber from 'bignumber.js';

import { BLOCK_VALIDATION_RATE_IN_SECONDS } from 'constants/bsc';
import { IProposal } from 'types';
import { IProposalApiResponse } from './types';

const formatToProposal = ({
  abstainedVotes,
  actions,
  againstVotes,
  blockNumber,
  cancelTimestamp,
  createdAt,
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
}: IProposalApiResponse['result'][number]): IProposal => {
  let endDate = typeof endTimestamp === 'number' ? new Date(endTimestamp) : undefined;

  if (!endDate) {
    const blocksLeft = endBlock - blockNumber;
    const secondsUntilEnd = blocksLeft * BLOCK_VALIDATION_RATE_IN_SECONDS;
    const now = new Date();
    now.setSeconds(now.getSeconds() + secondsUntilEnd);
    endDate = now;
  }

  const cancelDate = typeof cancelTimestamp === 'number' ? new Date(cancelTimestamp) : undefined;

  return {
    abstainedVotesWei: new BigNumber(abstainedVotes || 0),
    actions,
    againstVotesWei: new BigNumber(againstVotes || 0),
    blockNumber,
    cancelTimestamp: cancelTimestamp ?? undefined,
    createdAt,
    createdTimestamp,
    description,
    endBlock,
    endTimestamp: endTimestamp ?? undefined,
    executedTimestamp,
    forVotesWei: new BigNumber(forVotes || 0),
    id,
    proposer,
    queuedTimestamp,
    startTimestamp,
    state,
    cancelDate,
    endDate,
  };
};

export default formatToProposal;
