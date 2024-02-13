import { ContractTransaction } from 'ethers';

import { IsolatedPoolComptroller, LegacyPoolComptroller } from 'libs/contracts';
import { VToken } from 'types';

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
