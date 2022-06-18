import BigNumber from 'bignumber.js';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import { useStakeWeiInXvsVault, useStakeWeiInVaiVault } from 'clients/api';

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
  // TODO: handle errors
  const { mutateAsync: stakeWeiInXvsVault, isLoading: isStakeWeiInXvsVaultLoading } =
    useStakeWeiInXvsVault({ stakedTokenId });

  const { mutateAsync: stakeWeiInVaiVault, isLoading: isStakeWeiInVaiVaultLoading } =
    useStakeWeiInVaiVault();

  const isLoading = isStakeWeiInXvsVaultLoading || isStakeWeiInVaiVaultLoading;

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

    if (stakedTokenId === 'vai') {
      return stakeWeiInVaiVault({
        fromAccountAddress: accountAddress,
        amountWei,
      });
    }

    // TODO: handle staking in VRT vault

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
