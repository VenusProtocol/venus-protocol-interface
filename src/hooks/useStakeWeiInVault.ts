import BigNumber from 'bignumber.js';

import { TokenId } from 'types';
import { getToken } from 'utilities';
import { VError } from 'errors';
import { useTranslation } from 'translation';
import { useStakeWeiInXvsVault, useStakeWeiInVaiVault, useStakeWeiInVrtVault } from 'clients/api';

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
  const { t } = useTranslation();

  const { mutateAsync: stakeWeiInXvsVault, isLoading: isStakeWeiInXvsVaultLoading } =
    useStakeWeiInXvsVault({ stakedTokenId });

  const { mutateAsync: stakeWeiInVaiVault, isLoading: isStakeWeiInVaiVaultLoading } =
    useStakeWeiInVaiVault();

  const { mutateAsync: stakeWeiInVrtVault, isLoading: isStakeWeiInVrtVaultLoading } =
    useStakeWeiInVrtVault();

  const isLoading =
    isStakeWeiInXvsVaultLoading || isStakeWeiInVaiVaultLoading || isStakeWeiInVrtVaultLoading;

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

    if (stakedTokenId === 'vrt') {
      return stakeWeiInVrtVault({
        fromAccountAddress: accountAddress,
        amountWei,
      });
    }

    // This cose should never be reached, but just in case we throw a generic
    // internal error
    throw new VError({
      type: 'unexpected',
      code: t('errors.somethingWentWrong'),
    });
  };

  return {
    isLoading,
    stake,
  };
};

export default useStakeWeiInVault;
