import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import { unsafelyGetToken } from 'utilities';

import { useStakeInVaiVault, useStakeInVrtVault, useStakeInXvsVault } from 'clients/api';

export interface UseStakeInVaultInput {
  stakedTokenId: string;
  rewardTokenId: string;
  poolIndex?: number;
}

interface StakeInput {
  amountWei: BigNumber;
  accountAddress: string;
}

const useStakeInVault = ({ stakedTokenId, rewardTokenId, poolIndex }: UseStakeInVaultInput) => {
  const { mutateAsync: stakeInXvsVault, isLoading: isStakeInXvsVaultLoading } = useStakeInXvsVault({
    stakedTokenId,
  });

  const { mutateAsync: stakeInVaiVault, isLoading: isStakeInVaiVaultLoading } =
    useStakeInVaiVault();

  const { mutateAsync: stakeInVrtVault, isLoading: isStakeInVrtVaultLoading } =
    useStakeInVrtVault();

  const isLoading =
    isStakeInXvsVaultLoading || isStakeInVaiVaultLoading || isStakeInVrtVaultLoading;

  const stake = async ({ amountWei, accountAddress }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      const rewardTokenAddress = unsafelyGetToken(rewardTokenId).address;

      return stakeInXvsVault({
        poolIndex,
        fromAccountAddress: accountAddress,
        rewardTokenAddress,
        amountWei,
      });
    }

    if (stakedTokenId === 'vai') {
      return stakeInVaiVault({
        fromAccountAddress: accountAddress,
        amountWei,
      });
    }

    if (stakedTokenId === 'vrt') {
      return stakeInVrtVault({
        fromAccountAddress: accountAddress,
        amountWei,
      });
    }

    // This cose should never be reached, but just in case we throw a generic
    // internal error
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  };

  return {
    isLoading,
    stake,
  };
};

export default useStakeInVault;
