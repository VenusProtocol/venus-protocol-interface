import { VaiUnitroller } from 'types/contracts';

const vaiUnitrollerResponses: {
  getMintableVAI: Awaited<
    ReturnType<ReturnType<VaiUnitroller['methods']['getMintableVAI']>['call']>
  >;
} = {
  getMintableVAI: {
    0: '20000000000000000000',
    1: '30000000000000000000',
  },
};

export default vaiUnitrollerResponses;
