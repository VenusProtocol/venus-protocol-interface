// import type { Vault } from 'types';
// import { useGetPool } from '../useGetPool';
import { useGetTokens } from 'libs/tokens';
import { findTokenByAddress } from 'utilities';
import type { GetVaultProductsResponse } from './types';

export const useFormatToVault = () => {
  const tokens = useGetTokens();

  const formatToVault = (item: GetVaultProductsResponse['result'][number]) => {
    const now = new Date().getTime();

    return {
      stakedToken: findTokenByAddress({ address: item.vTokenAddress, tokens }),
      rewardToken: findTokenByAddress({
        address: item.protocolData?.accountingAsset?.address,
        tokens,
      }),
      stakingAprPercentage: item.fixedApyDecimal,
      lockingPeriodMs: new Date(item.underlyingToken[0]?.maturityDate).getTime() - now,
      poolIndex: 0, // TODO
      userHasPendingWithdrawalsFromBeforeUpgrade: false,
      stakedTokenPriceUsd: item.protocolData?.ptTokenPriceUsd,
    };
  };

  return {
    formatToVault,
  };
};
