import { Vault } from 'types';

import { useGetBalanceOf } from 'clients/api';
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
  const { data: totalVaiStakedWei } = useGetBalanceOf({
    accountAddress: VAI_VAULT_ADDRESS,
    tokenId: VAI_TOKEN_ID,
  });

  console.log(accountAddress);

  console.log(totalVaiStakedWei?.toFixed());

  return {
    data: undefined,
    isLoading: false,
  };
};

export default useGetVaiVault;
