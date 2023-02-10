import { VaiController } from 'types/contracts';

const vaiControllerResponses: {
  getMintableVAI: Awaited<
    ReturnType<ReturnType<VaiController['methods']['getMintableVAI']>['call']>
  >;
  getVAIRepayRatePerBlock: Awaited<
    ReturnType<ReturnType<VaiController['methods']['getVAIRepayRatePerBlock']>['call']>
  >;
} = {
  getMintableVAI: {
    0: '20000000000000000000',
    1: '40000000000000000000',
  },
  getVAIRepayRatePerBlock: '4000000000000000000',
};

export default vaiControllerResponses;
