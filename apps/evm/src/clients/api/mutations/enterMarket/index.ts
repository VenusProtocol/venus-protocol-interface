import type { ContractTransaction } from 'ethers';

import type { IsolatedPoolComptroller, LegacyPoolComptroller } from 'libs/contracts';
import type { VToken } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export type EnterMarketInput = {
  comptrollerContract: LegacyPoolComptroller | IsolatedPoolComptroller;
  vToken: VToken;
};

export type EnterMarketOutput = ContractTransaction;

const enterMarket = async ({
  comptrollerContract,
  vToken,
}: EnterMarketInput): Promise<EnterMarketOutput> =>
  requestGaslessTransaction(comptrollerContract, 'enterMarkets', [vToken.address]);

export default enterMarket;
