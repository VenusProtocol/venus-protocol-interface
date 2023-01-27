import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

export interface GetCurrentVotesInput {
  xvsVaultContract: XvsVault;
  accountAddress: string;
}

export type GetCurrentVotesOutput = {
  votesWei: BigNumber;
};

const getCurrentVotes = async ({
  xvsVaultContract,
  accountAddress,
}: GetCurrentVotesInput): Promise<GetCurrentVotesOutput> => {
  const resp = await xvsVaultContract.getCurrentVotes(accountAddress);

  return {
    votesWei: new BigNumber(resp.toString()),
  };
};

export default getCurrentVotes;
