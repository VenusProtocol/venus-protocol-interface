import BigNumber from 'bignumber.js';

import { BLOCK_VALIDATION_RATE_IN_SECONDS } from 'constants/bsc';
import { IProposal } from 'types';
import { IProposalApiResponse } from './types';

const createDateFromSecondsTimestamp = (timestampInSeconds: number): Date => {
  const inMilliseconds = timestampInSeconds * 1000;
  return new Date(inMilliseconds);
};

const formatToProposal = ({
  abstainedVotes,
  actions,
  againstVotes,
  blockNumber,
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
}: IProposalApiResponse['result'][number]): IProposal => {
  let endDate = endTimestamp ? createDateFromSecondsTimestamp(endTimestamp) : undefined;

  if (!endDate) {
    const blocksLeft = endBlock - blockNumber;
    const secondsUntilEnd = blocksLeft * BLOCK_VALIDATION_RATE_IN_SECONDS;
    const now = new Date();
    now.setSeconds(now.getSeconds() + secondsUntilEnd);
    endDate = now;
  }

  return {
    abstainedVotesWei: new BigNumber(abstainedVotes || 0),
    actions,
    againstVotesWei: new BigNumber(againstVotes || 0),
    blockNumber,
    cancelDate: cancelTimestamp ? createDateFromSecondsTimestamp(cancelTimestamp) : undefined,
    createdDate: createDateFromSecondsTimestamp(createdTimestamp),
    description,
    endBlock,
    endDate,
    executedDate: createDateFromSecondsTimestamp(executedTimestamp),
    forVotesWei: new BigNumber(forVotes || 0),
    id,
    proposer,
    queuedDate: createDateFromSecondsTimestamp(queuedTimestamp),
    startDate: createDateFromSecondsTimestamp(startTimestamp),
    state,
  };
};

export default formatToProposal;
