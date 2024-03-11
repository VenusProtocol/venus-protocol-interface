import { BigNumber as BN } from 'ethers';

import type { Vai } from 'libs/contracts';

const vaiContractResponses: {
  totalSupply: Awaited<ReturnType<Vai['totalSupply']>>;
} = {
  totalSupply: BN.from('50000000000000000000'),
};

export default vaiContractResponses;
