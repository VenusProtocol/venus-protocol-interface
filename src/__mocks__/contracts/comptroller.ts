import { Comptroller } from 'types/contracts';

const comptrollerResponses: {
  venusVAIVaultRate: Awaited<
    ReturnType<ReturnType<Comptroller['methods']['venusVAIVaultRate']>['call']>
  >;
  getHypotheticalAccountLiquidity: Awaited<
    ReturnType<ReturnType<Comptroller['methods']['getHypotheticalAccountLiquidity']>['call']>
  >;
} = {
  venusVAIVaultRate: '5000000000',
  getHypotheticalAccountLiquidity: {
    0: '100000000',
    1: '200000000',
    2: '300000000',
  },
};

export default comptrollerResponses;
