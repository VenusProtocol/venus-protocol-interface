import BigNumber from 'bignumber.js';
import { VaiController } from 'packages/contracts';

import { GetMintableVaiOutput } from './types';

const formatToProposal = (
  response: Awaited<ReturnType<VaiController['getMintableVAI']>>,
): GetMintableVaiOutput => ({
  mintableVaiWei: new BigNumber(response[1].toString()),
});

export default formatToProposal;
