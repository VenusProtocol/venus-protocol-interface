import { VError } from 'errors';
import { Token } from 'types';
import { areTokensEqual } from 'utilities';

import {
  useClaimVaiVaultReward,
  useClaimVrtVaultReward,
  useClaimXvsVaultReward,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';

interface StakeInput {
  rewardToken: Token;
  stakedToken: Token;
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

  const claimReward = async ({ rewardToken, stakedToken, poolIndex }: StakeInput) => {
    if (typeof poolIndex === 'number') {
      return claimXvsVaultRewardLoading({
        poolIndex,
        rewardToken,
      });
    }

    if (areTokensEqual(stakedToken, TOKENS.vai)) {
      return claimVaiVaultReward();
    }

    if (areTokensEqual(stakedToken, TOKENS.vrt)) {
      return claimVrtVaultReward();
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
