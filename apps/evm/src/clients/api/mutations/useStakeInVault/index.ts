import type BigNumber from 'bignumber.js';

import { useStakeInVaiVault, useStakeInXvsVault } from 'clients/api';
import { VError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import type { Token } from 'types';
import { areTokensEqual } from 'utilities';

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

  const { mutateAsync: stakeInXvsVault, isPending: isStakeInXvsVaultLoading } = useStakeInXvsVault({
    stakedToken,
    rewardToken,
  });

  const { mutateAsync: stakeInVaiVault, isPending: isStakeInVaiVaultLoading } =
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
