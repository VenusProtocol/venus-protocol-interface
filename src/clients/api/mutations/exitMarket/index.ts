import { checkForComptrollerTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface ExitMarketInput {
  comptrollerContract: ContractTypeByName<'mainPoolComptroller' | 'isolatedPoolComptroller'>;
  vTokenAddress: string;
}

export type ExitMarketOutput = ContractReceipt;

const exitMarket = async ({
  comptrollerContract,
  vTokenAddress,
}: ExitMarketInput): Promise<ExitMarketOutput> => {
  const transaction = await comptrollerContract.exitMarket(vTokenAddress);
  const receipt = await transaction.wait(1);
  return checkForComptrollerTransactionError(receipt);
};

export default exitMarket;
