import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

const comptrollerResponses: {
  venusVAIVaultRate: Awaited<
    ReturnType<ContractTypeByName<'mainPoolComptroller'>['venusVAIVaultRate']>
  >;
  getHypotheticalAccountLiquidity: Awaited<
    ReturnType<ContractTypeByName<'mainPoolComptroller'>['getHypotheticalAccountLiquidity']>
  >;
  mintedVAIs: Awaited<ReturnType<ContractTypeByName<'mainPoolComptroller'>['mintedVAIs']>>;
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
