import { TokenId } from 'types';
import { getToken } from 'utilities';
import { VError } from 'errors';
import {
  useClaimXvsVaultReward,
  useClaimVaiVaultReward,
  useClaimVrtVaultReward,
} from 'clients/api';

interface IStakeInput {
  rewardTokenId: TokenId;
  stakedTokenId: TokenId;
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
    rewardTokenId,
    stakedTokenId,
    accountAddress,
    poolIndex,
  }: IStakeInput) => {
    if (typeof poolIndex === 'number') {
      const rewardTokenAddress = getToken(rewardTokenId).address;

      return claimXvsVaultRewardLoading({
        poolIndex,
        fromAccountAddress: accountAddress,
        rewardTokenAddress,
      });
    }

    if (stakedTokenId === 'vai') {
      return claimVaiVaultReward({
        fromAccountAddress: accountAddress,
      });
    }

    if (stakedTokenId === 'vrt') {
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
