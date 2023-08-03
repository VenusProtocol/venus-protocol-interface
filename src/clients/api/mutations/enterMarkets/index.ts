import { checkForComptrollerTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface EnterMarketsInput {
  comptrollerContract: ContractTypeByName<'mainPoolComptroller'>;
  vTokenAddresses: string[];
}

export type EnterMarketsOutput = ContractReceipt;

const enterMarkets = async ({
  comptrollerContract,
  vTokenAddresses,
}: EnterMarketsInput): Promise<EnterMarketsOutput> => {
  const transaction = await comptrollerContract.enterMarkets(vTokenAddresses);
  const receipt = await transaction.wait(1);
  return checkForComptrollerTransactionError(receipt);
};

export default enterMarkets;
