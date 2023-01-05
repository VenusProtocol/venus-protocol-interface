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
  accountAddress: string;
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

  const stake = async ({ amountWei, accountAddress }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      return stakeInXvsVault({
        poolIndex,
        fromAccountAddress: accountAddress,
        rewardToken,
        amountWei,
      });
    }

    if (areTokensEqual(stakedToken, TOKENS.vai)) {
      return stakeInVaiVault({
        fromAccountAddress: accountAddress,
        amountWei,
      });
    }

    if (areTokensEqual(stakedToken, TOKENS.vrt)) {
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
