import { Vault } from 'types';

import { useGetBalanceOf, useGetVenusVaiVaultRate } from 'clients/api';
import { VAI_TOKEN_ID, VAI_VAULT_ADDRESS } from './constants';

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

// {
//   rewardTokenId: XVS_TOKEN_ID,
//   stakedTokenId,
//   dailyEmissionWei,
//   totalStakedWei,
//   stakingAprPercentage,
//   userStakedWei,
//   userPendingRewardWei,
// }

const useGetVaiVault = ({ accountAddress }: { accountAddress?: string }): UseGetVaiVaultOutput => {
  const { data: totalVaiStakedWei, isLoading: isGetTotalVaiStakedWeiLoading } = useGetBalanceOf({
    accountAddress: VAI_VAULT_ADDRESS,
    tokenId: VAI_TOKEN_ID,
  });

  const { data: venusVaiVaultRate, isLoading: isGetVenusVaiVaultRateLoading } =
    useGetVenusVaiVaultRate();

  console.log(accountAddress);

  console.log(totalVaiStakedWei?.toFixed());
  console.log(venusVaiVaultRate?.toFixed());

  const isLoading = isGetTotalVaiStakedWeiLoading || isGetVenusVaiVaultRateLoading;

  return {
    data: undefined,
    isLoading,
  };
};

export default useGetVaiVault;
