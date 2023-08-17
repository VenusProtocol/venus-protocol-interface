import { checkForComptrollerTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';
import { VToken } from 'types';

export interface ExitMarketInput {
  comptrollerContract: ContractTypeByName<'mainPoolComptroller' | 'isolatedPoolComptroller'>;
  vToken: VToken;
}

export type ExitMarketOutput = ContractReceipt;

const exitMarket = async ({
  comptrollerContract,
  vToken,
}: ExitMarketInput): Promise<ExitMarketOutput> => {
  const transaction = await comptrollerContract.exitMarket(vToken.address);
  const receipt = await transaction.wait(1);
  return checkForComptrollerTransactionError(receipt);
};

export default exitMarket;
