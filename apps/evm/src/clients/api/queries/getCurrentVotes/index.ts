import BigNumber from 'bignumber.js';
import { XvsVault } from 'libs/contracts';

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
