import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

export interface GetCurrentVotesInput {
  xvsVaultContract: XvsVault;
  accountAddress: string;
}

export type GetCurrentVotesOutput = BigNumber;

const getCurrentVotes = async ({
  xvsVaultContract,
  accountAddress,
}: GetCurrentVotesInput): Promise<GetCurrentVotesOutput> => {
  const resp = await xvsVaultContract.methods.getCurrentVotes(accountAddress).call();
  return new BigNumber(resp);
};

export default getCurrentVotes;
