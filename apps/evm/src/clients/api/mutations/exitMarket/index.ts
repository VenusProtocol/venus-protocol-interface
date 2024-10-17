import type { IsolatedPoolComptroller, LegacyPoolComptroller } from 'libs/contracts';
import type { ContractTxData, VToken } from 'types';

export type ExitMarketInput = {
  comptrollerContract: LegacyPoolComptroller | IsolatedPoolComptroller;
  vToken: VToken;
};

export type ExitMarketOutput = ContractTxData<
  LegacyPoolComptroller | IsolatedPoolComptroller,
  'exitMarket'
>;

const exitMarket = ({ comptrollerContract, vToken }: ExitMarketInput): ExitMarketOutput => ({
  contract: comptrollerContract,
  methodName: 'exitMarket',
  args: [vToken.address],
});

export default exitMarket;
