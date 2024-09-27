import type { ContractTransaction } from 'ethers';

import type { IsolatedPoolComptroller, LegacyPoolComptroller } from 'libs/contracts';
import type { VToken } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export type ExitMarketInput = {
  comptrollerContract: LegacyPoolComptroller | IsolatedPoolComptroller;
  vToken: VToken;
};

export type ExitMarketOutput = ContractTransaction;

const exitMarket = async ({
  comptrollerContract,
  vToken,
}: ExitMarketInput): Promise<ExitMarketOutput> =>
  requestGaslessTransaction(comptrollerContract, 'exitMarket', vToken.address);

export default exitMarket;
