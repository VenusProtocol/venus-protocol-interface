import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

const vaiControllerResponses: {
  getMintableVAI: Awaited<ReturnType<ContractTypeByName<'vaiController'>['getMintableVAI']>>;
  getVAIRepayRatePerBlock: Awaited<
    ReturnType<ContractTypeByName<'vaiController'>['getVAIRepayRatePerBlock']>
  >;
} = {
  getMintableVAI: [BN.from('20000000000000000000'), BN.from('40000000000000000000')],
  getVAIRepayRatePerBlock: BN.from('4000000000000000000'),
};

export default vaiControllerResponses;
