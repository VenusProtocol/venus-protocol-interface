import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import { GetMintableVaiOutput } from './types';

const formatToProposal = (
  response: Awaited<ReturnType<ContractTypeByName<'vaiController'>['getMintableVAI']>>,
): GetMintableVaiOutput => ({
  mintableVaiWei: new BigNumber(response[1].toString()),
});

export default formatToProposal;
