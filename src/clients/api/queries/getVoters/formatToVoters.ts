import BigNumber from 'bignumber.js';
import { IVoter } from 'types';

import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';

import { IGetVotersApiResponse } from './types';

const formatToVoter = (payload: IGetVotersApiResponse): IVoter => ({
  result: payload.result.map(({ address, reason, votes, support, hasVoted }) => ({
    address,
    voteWeightWei: new BigNumber(votes),
    reason: reason ?? undefined,
    support: hasVoted ? indexedVotingSupportNames[support] : 'NOT_VOTED',
  })),
  sumVotes: {
    abstain: new BigNumber(payload.sumVotes.abstain),
    against: new BigNumber(payload.sumVotes.against),
    for: new BigNumber(payload.sumVotes.for),
    total: new BigNumber(payload.sumVotes.total),
  },
});

export default formatToVoter;
