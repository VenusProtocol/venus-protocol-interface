import { checkForComptrollerTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { IsolatedPoolComptroller, MainPoolComptroller } from 'packages/contractsNew';
import { VToken } from 'types';

export interface EnterMarketInput {
  comptrollerContract: MainPoolComptroller | IsolatedPoolComptroller;
  vToken: VToken;
}

export type EnterMarketOutput = ContractReceipt;

const enterMarket = async ({
  comptrollerContract,
  vToken,
}: EnterMarketInput): Promise<EnterMarketOutput> => {
  const transaction = await comptrollerContract.enterMarkets([vToken.address]);
  const receipt = await transaction.wait(1);
  return checkForComptrollerTransactionError(receipt);
};

export default enterMarket;
