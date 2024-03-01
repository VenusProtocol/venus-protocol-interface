import { BigNumber as BN } from 'ethers';

import { VaiController } from 'libs/contracts';

const vaiControllerResponses: {
  getMintableVAI: Awaited<ReturnType<VaiController['getMintableVAI']>>;
  getVAIRepayRate: Awaited<ReturnType<VaiController['getVAIRepayRatePerBlock']>>;
  mintCap: Awaited<ReturnType<VaiController['mintCap']>>;
} = {
  getMintableVAI: [BN.from('0'), BN.from('40000000000000000000')],
  getVAIRepayRate: BN.from('40000000000000000'),
  mintCap: BN.from('90000000000000000000'),
};

export default vaiControllerResponses;
