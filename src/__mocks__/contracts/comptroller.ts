import { BigNumber as BN } from 'ethers';

import { Comptroller } from 'types/contracts';

const comptrollerResponses: {
  venusVAIVaultRate: Awaited<ReturnType<Comptroller['venusVAIVaultRate']>>;
  getHypotheticalAccountLiquidity: Awaited<
    ReturnType<Comptroller['getHypotheticalAccountLiquidity']>
  >;
  mintedVAIs: Awaited<ReturnType<Comptroller['mintedVAIs']>>;
} = {
  venusVAIVaultRate: BN.from('5000000000'),
  getHypotheticalAccountLiquidity: [
    BN.from('100000000'),
    BN.from('200000000'),
    BN.from('300000000'),
  ],
  mintedVAIs: BN.from('60000000000000000'),
};

export default comptrollerResponses;
