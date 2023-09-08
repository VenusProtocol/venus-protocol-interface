import BigNumber from 'bignumber.js';

import { GetVoteSummaryApiResponse } from './types';

const formatToVoteSummary = ({ payload }: { payload: GetVoteSummaryApiResponse }) => ({
  for: new BigNumber(payload.for),
  abstain: new BigNumber(payload.abstain),
  against: new BigNumber(payload.against),
  total: new BigNumber(payload.total),
});

export default formatToVoteSummary;
