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
  createdTxHash,
  cancelTxHash,
  endTxHash,
  executedTxHash,
  queuedTxHash,
  startTxHash,
}: IProposalApiResponse): IProposal => {
  let endDate = endTimestamp ? createDateFromSecondsTimestamp(endTimestamp) : undefined;

  let descriptionObj = { version: 'v1' as const, title: '', description: '' };
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

    descriptionObj = { version: 'v1' as const, title: plainTitle, description: descriptionText };
  }

  if (!endDate) {
    const blocksLeft = endBlock - blockNumber;
    const secondsUntilEnd = blocksLeft * BLOCK_VALIDATION_RATE_IN_SECONDS;
    const now = new Date();
    now.setSeconds(now.getSeconds() + secondsUntilEnd);
    endDate = now;
  }
  const abstainedVotesWei = new BigNumber(abstainedVotes || 0);
  const againstVotesWei = new BigNumber(againstVotes || 0);
  const forVotesWei = new BigNumber(forVotes || 0);

  return {
    abstainedVotesWei,
    actions,
    againstVotesWei,
    blockNumber,
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

export default formatToProposal;
