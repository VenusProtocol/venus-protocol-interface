import { ContractTransaction } from 'ethers';
import { IsolatedPoolComptroller, MainPoolComptroller } from 'packages/contracts';
import { VToken } from 'types';

export type EnterMarketInput = {
  comptrollerContract: MainPoolComptroller | IsolatedPoolComptroller;
  vToken: VToken;
};

export type EnterMarketOutput = ContractTransaction;

const enterMarket = async ({
  comptrollerContract,
  vToken,
}: EnterMarketInput): Promise<EnterMarketOutput> =>
  comptrollerContract.enterMarkets([vToken.address]);

export default enterMarket;
