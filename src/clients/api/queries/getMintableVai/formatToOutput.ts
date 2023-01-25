import BigNumber from 'bignumber.js';

import { VaiUnitroller } from 'types/contracts';

import { GetMintableVaiOutput } from './types';

const formatToProposal = (
  response: Awaited<ReturnType<VaiUnitroller['getMintableVAI']>>,
): GetMintableVaiOutput => ({
  mintableVaiWei: new BigNumber(response[1].toString()),
});

export default formatToProposal;
