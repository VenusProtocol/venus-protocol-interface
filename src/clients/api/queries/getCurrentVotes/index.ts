import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetCurrentVotesInput {
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
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
