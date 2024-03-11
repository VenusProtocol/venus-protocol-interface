import BigNumber from 'bignumber.js';

import type { GetVoterAccountsResponse } from './types';

const formatVoterResponse = ({
  data,
  totalStakedXvs,
}: {
  data: GetVoterAccountsResponse;
  totalStakedXvs: BigNumber;
}) => ({
  limit: data.limit,
  offset: +data.page * data.limit,
  total: data.total,
  voterAccounts: data.result.map(d => ({
    address: d.address,
    delegate: d.delegate || '',
    proposalsVoted: d.proposalsVoted,
    voteWeightPercent: new BigNumber(d.votesMantissa)
      .dividedBy(totalStakedXvs)
      .multipliedBy(100)
      .toFixed(),
    stakedVotesMantissa: new BigNumber(d.stakedVotesMantissa),
    votesMantissa: new BigNumber(d.votesMantissa),
  })),
});

export default formatVoterResponse;
