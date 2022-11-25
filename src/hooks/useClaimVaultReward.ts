import { VError } from 'errors';
import { Token } from 'types';

import {
  useClaimVaiVaultReward,
  useClaimVrtVaultReward,
  useClaimXvsVaultReward,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';

interface StakeInput {
  rewardToken: Token;
  stakedToken: Token;
  accountAddress: string;
  poolIndex?: number;
}

const useClaimVaultReward = () => {
  const { mutateAsync: claimXvsVaultRewardLoading, isLoading: isClaimXvsVaultRewardLoading } =
    useClaimXvsVaultReward();

  const { mutateAsync: claimVaiVaultReward, isLoading: isClaimVaiVaultReward } =
    useClaimVaiVaultReward();

  const { mutateAsync: claimVrtVaultReward, isLoading: isClaimVrtVaultReward } =
    useClaimVrtVaultReward();

  const isLoading = isClaimXvsVaultRewardLoading || isClaimVaiVaultReward || isClaimVrtVaultReward;

  const claimReward = async ({
    rewardToken,
    stakedToken,
    accountAddress,
    poolIndex,
  }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      return claimXvsVaultRewardLoading({
        poolIndex,
        fromAccountAddress: accountAddress,
        rewardToken,
      });
    }

    if (stakedToken.address.toLowerCase() === TOKENS.vai.address.toLowerCase()) {
      return claimVaiVaultReward({
        fromAccountAddress: accountAddress,
      });
    }

    if (stakedToken.address.toLowerCase() === TOKENS.vrt.address.toLowerCase()) {
      return claimVrtVaultReward({
        fromAccountAddress: accountAddress,
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
    claimReward,
  };
};

export default useClaimVaultReward;
