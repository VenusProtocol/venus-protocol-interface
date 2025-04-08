import type { XvsVault } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface SetVoteDelegateInput {
  xvsVaultContract: XvsVault;
  delegateAddress: string;
}

type SetVoteDelegateOutput = LooseEthersContractTxData;

const setVoteDelegate = ({
  xvsVaultContract,
  delegateAddress,
}: SetVoteDelegateInput): SetVoteDelegateOutput => ({
  contract: xvsVaultContract,
  methodName: 'delegate',
  args: [delegateAddress],
});

export default setVoteDelegate;
