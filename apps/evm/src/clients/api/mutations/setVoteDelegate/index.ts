import type { XvsVault } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface SetVoteDelegateInput {
  xvsVaultContract: XvsVault;
  delegateAddress: string;
}

type SetVoteDelegateOutput = ContractTxData<XvsVault, 'delegate'>;

const setVoteDelegate = async ({
  xvsVaultContract,
  delegateAddress,
}: SetVoteDelegateInput): Promise<SetVoteDelegateOutput> => ({
  contract: xvsVaultContract,
  methodName: 'delegate',
  args: [delegateAddress],
});

export default setVoteDelegate;
