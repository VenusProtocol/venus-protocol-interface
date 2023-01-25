import { BigNumber as BN } from 'ethers';

import { VaiUnitroller } from 'types/contracts';

const vaiUnitrollerResponses: {
  getMintableVAI: Awaited<ReturnType<VaiUnitroller['getMintableVAI']>>;
} = {
  getMintableVAI: [BN.from('20000000000000000000'), BN.from('40000000000000000000')],
};

export default vaiUnitrollerResponses;
