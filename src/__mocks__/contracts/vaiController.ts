import { VaiController } from 'types/contracts';

const vaiControllerResponses: {
  getVAICalculateRepayAmount: Awaited<
    ReturnType<ReturnType<VaiController['methods']['getVAICalculateRepayAmount']>['call']>
  >;
} = {
  getVAICalculateRepayAmount: {
    0: '5000000000000000000',
    1: '4000000000000000000',
    2: '1000000000000000000',
  },
};

export default vaiControllerResponses;
