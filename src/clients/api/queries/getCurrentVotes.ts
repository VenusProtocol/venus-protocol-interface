import BigNumber from 'bignumber.js';
import { XvsVault } from 'types/contracts';

export interface IGetCurrentVotesInput {
  xvsVaultContract: XvsVault;
  accountAddress: string;
}

export type GetCurrentVotesOutput = BigNumber;

const getCurrentVotes = async ({
  xvsVaultContract,
  accountAddress,
}: IGetCurrentVotesInput): Promise<GetCurrentVotesOutput> => {
  const resp = await xvsVaultContract.methods.getCurrentVotes(accountAddress).call();
  return new BigNumber(resp);
};

export default getCurrentVotes;
