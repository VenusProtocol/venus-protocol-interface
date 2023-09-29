import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import { useGetToken } from 'packages/tokens';
import { Token } from 'types';
import { areTokensEqual } from 'utilities';

import { useStakeInVaiVault, useStakeInXvsVault } from 'clients/api';

export interface UseStakeInVaultInput {
  stakedToken: Token;
  rewardToken: Token;
  poolIndex?: number;
}

interface StakeInput {
  amountWei: BigNumber;
}

const useStakeInVault = ({ stakedToken, rewardToken, poolIndex }: UseStakeInVaultInput) => {
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { mutateAsync: stakeInXvsVault, isLoading: isStakeInXvsVaultLoading } = useStakeInXvsVault({
    stakedToken,
    rewardToken,
  });

  const { mutateAsync: stakeInVaiVault, isLoading: isStakeInVaiVaultLoading } =
    useStakeInVaiVault();

  const isLoading = isStakeInXvsVaultLoading || isStakeInVaiVaultLoading;

  const stake = async ({ amountWei }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      return stakeInXvsVault({
        poolIndex,
        rewardToken,
        amountWei,
      });
    }

    if (vai && areTokensEqual(stakedToken, vai)) {
      return stakeInVaiVault({
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
