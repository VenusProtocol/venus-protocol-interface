import BigNumber from 'bignumber.js';
import { IVoter, VoteSupport } from 'types';
import { IGetVotersApiResponse } from './types';

const VOTE_SUPPORTS = ['FOR', 'AGAINST', 'ABSTAIN'];

const formatToVoter = (payload: IGetVotersApiResponse): IVoter => ({
  result: payload.result.map(({ address, reason, votes, support }) => ({
    address,
    voteWeightWei: new BigNumber(votes),
    reason: reason ?? undefined,
    support: VOTE_SUPPORTS[support] as VoteSupport,
  })),
  sumVotes: {
    abstain: new BigNumber(payload.sumVotes.abstain),
    against: new BigNumber(payload.sumVotes.against),
    for: new BigNumber(payload.sumVotes.for),
    total: new BigNumber(payload.sumVotes.total),
  },
});

export default formatToVoter;
