import { useGetPools, useGetVaults } from 'clients/api';
import { VIP_PORTFOLIO_THRESHOLD_CENTS } from 'constants/vip';
import { useAccountAddress } from 'libs/wallet';

export const useIsConnectedAccountVip = () => {
  const { accountAddress } = useAccountAddress();

  const { data: getPoolsData } = useGetPools({
    accountAddress,
  });

  const { data: getVaultsData } = useGetVaults({
    accountAddress,
  });

  let portfolioValueCents = 0;

  // Go through pools
  (getPoolsData?.pools ?? []).forEach(pool =>
    pool.assets.forEach(asset => {
      portfolioValueCents +=
        asset.userSupplyBalanceCents.toNumber() + asset.userBorrowBalanceCents.toNumber();
    }),
  );

  // Go through vaults
  getVaultsData.forEach(vault => {
    portfolioValueCents += vault.userStakeBalanceCents || 0;
  });

  const isConnectedAccountVip = portfolioValueCents >= VIP_PORTFOLIO_THRESHOLD_CENTS;

  return {
    isConnectedAccountVip,
  };
};
