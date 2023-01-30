import BigNumber from 'bignumber.js';

import { VaiController } from 'types/contracts';

import { GetMintableVaiOutput } from './types';

const formatToProposal = (
  response: Awaited<ReturnType<ReturnType<VaiController['methods']['getMintableVAI']>['call']>>,
): GetMintableVaiOutput => ({
  mintableVaiWei: new BigNumber(response[1]),
});

export default formatToProposal;
