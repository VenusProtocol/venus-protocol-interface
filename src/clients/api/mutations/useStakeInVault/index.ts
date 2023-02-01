import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import { Token } from 'types';
import { areTokensEqual } from 'utilities';

import { useStakeInVaiVault, useStakeInVrtVault, useStakeInXvsVault } from 'clients/api';
import { TOKENS } from 'constants/tokens';

export interface UseStakeInVaultInput {
  stakedToken: Token;
  rewardToken: Token;
  poolIndex?: number;
}

interface StakeInput {
  amountWei: BigNumber;
}

const useStakeInVault = ({ stakedToken, rewardToken, poolIndex }: UseStakeInVaultInput) => {
  const { mutateAsync: stakeInXvsVault, isLoading: isStakeInXvsVaultLoading } = useStakeInXvsVault({
    stakedToken,
  });

  const { mutateAsync: stakeInVaiVault, isLoading: isStakeInVaiVaultLoading } =
    useStakeInVaiVault();

  const { mutateAsync: stakeInVrtVault, isLoading: isStakeInVrtVaultLoading } =
    useStakeInVrtVault();

  const isLoading =
    isStakeInXvsVaultLoading || isStakeInVaiVaultLoading || isStakeInVrtVaultLoading;

  const stake = async ({ amountWei }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      return stakeInXvsVault({
        poolIndex,
        rewardToken,
        amountWei,
      });
    }

    if (areTokensEqual(stakedToken, TOKENS.vai)) {
      return stakeInVaiVault({
        amountWei,
      });
    }

    if (areTokensEqual(stakedToken, TOKENS.vrt)) {
      return stakeInVrtVault({
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
