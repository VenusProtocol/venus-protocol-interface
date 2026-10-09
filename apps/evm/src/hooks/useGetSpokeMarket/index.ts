import { useGetSpokePools } from 'clients/api';
import { useAccountAddress } from 'libs/wallet';
import type { SpokeAsset, SpokePool } from 'types';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';

export interface UseGetSpokeMarketInput {
  spokePoolComptrollerAddress?: Address;
  spokeVTokenAddress?: Address;
}

export interface UseGetSpokeMarketOutput {
  isLoading: boolean;
  spokePool?: SpokePool;
  asset?: SpokeAsset;
}

export const useGetSpokeMarket = ({
  spokePoolComptrollerAddress,
  spokeVTokenAddress,
}: UseGetSpokeMarketInput): UseGetSpokeMarketOutput => {
  const { accountAddress } = useAccountAddress();
  const { data, isLoading } = useGetSpokePools({ accountAddress });

  const spokePool = data?.spokePools.find(
    pool =>
      !!spokePoolComptrollerAddress &&
      areAddressesEqual(pool.comptrollerAddress, spokePoolComptrollerAddress),
  );

  const asset = spokePool?.assets.find(
    ({ vToken }) => !!spokeVTokenAddress && areAddressesEqual(vToken.address, spokeVTokenAddress),
  );

  return { isLoading, spokePool, asset };
};
