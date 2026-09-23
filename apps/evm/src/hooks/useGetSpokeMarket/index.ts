// TODO: fetch from API (VPD-2071)
import { spokePools } from '__mocks__/models/spokePools';
import type { SpokeAsset, SpokePool } from 'types';
import type { Address } from 'viem';

export interface UseGetSpokeMarketInput {
  spokePoolComptrollerAddress?: Address;
  spokeVTokenAddress?: Address;
}

export interface UseGetSpokeMarketOutput {
  spokePool?: SpokePool;
  asset?: SpokeAsset;
}

export const useGetSpokeMarket = ({
  spokePoolComptrollerAddress,
  spokeVTokenAddress,
}: UseGetSpokeMarketInput): UseGetSpokeMarketOutput => {
  const spokePool = spokePools.find(
    pool => pool.comptrollerAddress.toLowerCase() === spokePoolComptrollerAddress?.toLowerCase(),
  );

  const asset = spokePool?.assets.find(
    ({ vToken }) => vToken.address.toLowerCase() === spokeVTokenAddress?.toLowerCase(),
  );

  return { spokePool, asset };
};
