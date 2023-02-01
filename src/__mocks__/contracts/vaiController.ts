import { BigNumber as BN } from 'ethers';

import { VaiController } from 'types/contracts';

const vaiControllerResponses: {
  getMintableVAI: Awaited<ReturnType<VaiController['getMintableVAI']>>;
} = {
  getMintableVAI: [BN.from('20000000000000000000'), BN.from('40000000000000000000')],
};

export default vaiControllerResponses;
