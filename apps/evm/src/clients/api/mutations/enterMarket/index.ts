import type { IsolatedPoolComptroller, LegacyPoolComptroller } from 'libs/contracts';
import type { ContractTxData, VToken } from 'types';

export type EnterMarketInput = {
  comptrollerContract: LegacyPoolComptroller | IsolatedPoolComptroller;
  vToken: VToken;
};

export type EnterMarketOutput = ContractTxData<
  LegacyPoolComptroller | IsolatedPoolComptroller,
  'enterMarkets'
>;

const enterMarket = async ({
  comptrollerContract,
  vToken,
}: EnterMarketInput): Promise<EnterMarketOutput> => ({
  contract: comptrollerContract,
  methodName: 'enterMarkets',
  args: [[vToken.address]],
});

export default enterMarket;
