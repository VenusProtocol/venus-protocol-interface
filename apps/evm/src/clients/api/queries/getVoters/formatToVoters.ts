import BigNumber from 'bignumber.js';

import type { VotersDetails } from 'types';

import type { GetVotersApiResponse } from './types';

const formatToVoter = ({ payload }: { payload: GetVotersApiResponse }): VotersDetails => ({
  result: payload.result.map(
    ({ address, reason, votesMantissa, blockNumber, blockTimestamp, support }) => ({
      address,
      votesMantissa: new BigNumber(votesMantissa),
      reason: reason ?? undefined,
      support,
      blockNumber,
      blockTimestamp: new Date(blockTimestamp * 1000),
    }),
  ),
});

export default formatToVoter;
