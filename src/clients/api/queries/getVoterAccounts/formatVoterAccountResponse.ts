import BigNumber from 'bignumber.js';

import { GetVoterAccountsResponse } from './types';

const formatVoterResponse = (data: GetVoterAccountsResponse) => ({
  limit: data.limit,
  offset: data.offset,
  total: data.total,
  voterAccounts: data.result.map(d => ({
    address: d.address,
    createdAt: new Date(d.createdAt),
    id: d.id,
    proposalsVoted: d.proposalsVoted,
    updatedAt: new Date(d.updatedAt),
    voteWeightPercent: d.voteWeight,
    votesWei: new BigNumber(d.votes),
  })),
});

export default formatVoterResponse;
