import BigNumber from 'bignumber.js';
import { IVoter } from 'types';
import { getSupportName } from 'utilities';

import { IGetVotersApiResponse } from './types';

const formatToVoter = (payload: IGetVotersApiResponse): IVoter => ({
  result: payload.result.map(({ address, reason, votes, support }) => ({
    address,
    voteWeightWei: new BigNumber(votes),
    reason: reason ?? undefined,
    support: getSupportName(support),
  })),
  sumVotes: {
    abstain: new BigNumber(payload.sumVotes.abstain),
    against: new BigNumber(payload.sumVotes.against),
    for: new BigNumber(payload.sumVotes.for),
    total: new BigNumber(payload.sumVotes.total),
  },
});

export default formatToVoter;
