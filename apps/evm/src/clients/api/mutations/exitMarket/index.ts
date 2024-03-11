import type { ContractTransaction } from 'ethers';

import type { IsolatedPoolComptroller, LegacyPoolComptroller } from 'libs/contracts';
import type { VToken } from 'types';

export type ExitMarketInput = {
  comptrollerContract: LegacyPoolComptroller | IsolatedPoolComptroller;
  vToken: VToken;
};

export type ExitMarketOutput = ContractTransaction;

const exitMarket = async ({
  comptrollerContract,
  vToken,
}: ExitMarketInput): Promise<ExitMarketOutput> => comptrollerContract.exitMarket(vToken.address);

export default exitMarket;
