import BigNumber from 'bignumber.js';

import { XvsVault } from 'packages/contracts';

export interface GetCurrentVotesInput {
  xvsVaultContract: XvsVault;
  accountAddress: string;
}

export type GetCurrentVotesOutput = {
  votesMantissa: BigNumber;
};

const getCurrentVotes = async ({
  xvsVaultContract,
  accountAddress,
}: GetCurrentVotesInput): Promise<GetCurrentVotesOutput> => {
  const resp = await xvsVaultContract.getCurrentVotes(accountAddress);

  return {
    votesMantissa: new BigNumber(resp.toString()),
  };
};

export default getCurrentVotes;
