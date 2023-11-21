import BigNumber from 'bignumber.js';
import { useGetToken } from 'packages/tokens';
import { Token } from 'types';
import { areTokensEqual } from 'utilities';

import { useStakeInVaiVault, useStakeInXvsVault } from 'clients/api';
import { VError } from 'packages/errors/VError';

export interface UseStakeInVaultInput {
  stakedToken: Token;
  rewardToken: Token;
  poolIndex?: number;
}

interface StakeInput {
  amountMantissa: BigNumber;
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

  const stake = async ({ amountMantissa }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      return stakeInXvsVault({
        poolIndex,
        rewardToken,
        amountMantissa,
      });
    }

    if (vai && areTokensEqual(stakedToken, vai)) {
      return stakeInVaiVault({
        amountMantissa,
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
