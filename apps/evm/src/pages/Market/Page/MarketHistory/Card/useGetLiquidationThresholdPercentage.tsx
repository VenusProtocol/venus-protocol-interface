import { useGetIsolatedPoolVTokenLiquidationThreshold } from 'clients/api';
import { useChainId } from 'libs/wallet';
import type { Asset } from 'types';
import { isPoolIsolated } from 'utilities';

export const useGetLiquidationThresholdPercentage = (
  {
    asset,
    poolComptrollerContractAddress,
  }: { asset: Asset; poolComptrollerContractAddress: string },
  { enabled }: { enabled: boolean },
) => {
  const { chainId } = useChainId();

  const isIsolated = isPoolIsolated({
    chainId,
    comptrollerAddress: poolComptrollerContractAddress,
  });

  const { data: getIsolatedPoolVTokenLiquidationThresholdData } =
    useGetIsolatedPoolVTokenLiquidationThreshold(
      {
        poolComptrollerContractAddress,
        vTokenAddress: asset.vToken.address,
      },
      {
        enabled: enabled && isIsolated,
      },
    );

  return isIsolated
    ? getIsolatedPoolVTokenLiquidationThresholdData?.liquidationThresholdPercentage
    : asset.collateralFactor * 100;
};
