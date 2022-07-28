import BigNumber from 'bignumber.js';
import { VotersDetails } from 'types';

import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';

import { GetVotersApiResponse } from './types';

const formatToVoter = (payload: GetVotersApiResponse): VotersDetails => ({
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
