import { Comptroller } from 'types/contracts';

const comptrollerResponses: {
  venusVAIVaultRate: Awaited<
    ReturnType<ReturnType<Comptroller['methods']['venusVAIVaultRate']>['call']>
  >;
} = {
  venusVAIVaultRate: '5000000000',
};

export default comptrollerResponses;
