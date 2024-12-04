import BigNumber from 'bignumber.js';

import type { VoterHistory } from 'types';
import { formatToProposal } from './formatToProposal';

import type { GetVoterHistoryResponse } from './types';

const formatVoterHistoryResponse = (
  data: GetVoterHistoryResponse,
): {
  limit: number;
  page: number;
  total: number;
  voterHistory: VoterHistory[];
} => ({
  limit: data.limit,
  page: data.page,
  total: data.total,
  voterHistory: data.result.map(d => ({
    ...formatToProposal({ ...d, accountAddress: d.votes[0].address || '' }),
    support: d.votes[0].support,
    votesMantissa: new BigNumber(d.votes[0].votesMantissa),
    reason: d.votes[0].reason,
  })),
});

export default formatVoterHistoryResponse;
