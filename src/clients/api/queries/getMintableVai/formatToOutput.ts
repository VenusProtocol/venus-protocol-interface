import BigNumber from 'bignumber.js';

import { VaiUnitroller } from 'types/contracts';
import { GetMintableVaiOutput } from './types';

const formatToProposal = (
  response: Awaited<ReturnType<ReturnType<VaiUnitroller['methods']['getMintableVAI']>['call']>>,
): GetMintableVaiOutput => ({
  mintableVaiWei: new BigNumber(response[1]),
});

export default formatToProposal;
