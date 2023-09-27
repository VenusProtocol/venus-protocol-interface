import BigNumber from 'bignumber.js';
import { VotersDetails } from 'types';

import { GetVotersApiResponse } from './types';

const formatToVoter = ({ payload }: { payload: GetVotersApiResponse }): VotersDetails => ({
  result: payload.result.map(
    ({ address, reason, votesMantissa, blockNumber, blockTimestamp, support }) => ({
      address,
      votesMantissa: new BigNumber(votesMantissa),
      reason: reason ?? undefined,
      support,
      blockNumber,
      blockTimestamp: new Date(blockTimestamp),
    }),
  ),
});

export default formatToVoter;
