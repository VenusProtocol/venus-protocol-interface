import BigNumber from 'bignumber.js';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { useStakeWeiInXvsVault } from 'clients/api';

export interface IUseStakeWeiInVaultInput {
  stakedTokenId: TokenId;
}

interface IStakeInput {
  rewardTokenId: TokenId;
  amountWei: BigNumber;
  accountAddress: string;
  poolIndex?: number;
}

const useStakeWeiInVault = ({ stakedTokenId }: IUseStakeWeiInVaultInput) => {
  const { mutateAsync: stakeWeiInXvsVault, isLoading: isStakeWeiInXvsVaultLoading } =
    useStakeWeiInXvsVault({ stakedTokenId });

  const isLoading = isStakeWeiInXvsVaultLoading;

  const stake = async ({ rewardTokenId, amountWei, accountAddress, poolIndex }: IStakeInput) => {
    if (typeof poolIndex === 'number') {
      const rewardTokenAddress = getToken(rewardTokenId).address;

      return stakeWeiInXvsVault({
        poolIndex,
        fromAccountAddress: accountAddress,
        rewardTokenAddress,
        amountWei,
      });
    }

    // TODO: handle other mutations

    // DEV ONLY
    return fakeTransactionReceipt;
    // END DEV ONLY
  };

  return {
    isLoading,
    stake,
  };
};

export default useStakeWeiInVault;
