import { VaiController } from 'types/contracts';

const vaiControllerResponses: {
  getMintableVAI: Awaited<
    ReturnType<ReturnType<VaiController['methods']['getMintableVAI']>['call']>
  >;
} = {
  getMintableVAI: {
    0: '20000000000000000000',
    1: '40000000000000000000',
  },
};

export default vaiControllerResponses;
