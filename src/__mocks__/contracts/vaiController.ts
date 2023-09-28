import { BigNumber as BN } from 'ethers';
import { VaiController } from 'packages/contractsNew';

const vaiControllerResponses: {
  getMintableVAI: Awaited<ReturnType<VaiController['getMintableVAI']>>;
  getVAIRepayRatePerBlock: Awaited<ReturnType<VaiController['getVAIRepayRatePerBlock']>>;
} = {
  getMintableVAI: [BN.from('20000000000000000000'), BN.from('40000000000000000000')],
  getVAIRepayRatePerBlock: BN.from('4000000000000000000'),
};

export default vaiControllerResponses;
