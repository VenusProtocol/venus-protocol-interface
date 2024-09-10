import BigNumber from 'bignumber.js';

import type { VotersDetails } from 'types';

import type { GetVotersApiResponse } from './types';

const formatToVoter = ({ payload }: { payload: GetVotersApiResponse }): VotersDetails => ({
  result: payload.result.map(({ address, reason, votesMantissa, support, proposalId }) => ({
    proposalId,
    address,
    votesMantissa: new BigNumber(votesMantissa),
    reason: reason ?? undefined,
    support,
  })),
});

export default formatToVoter;
