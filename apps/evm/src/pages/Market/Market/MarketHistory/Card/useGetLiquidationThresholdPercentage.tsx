import { useGetIsolatedPoolVTokenLiquidationThreshold } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId } from 'libs/wallet';
import { type Asset, ChainId } from 'types';
import { areAddressesEqual } from 'utilities';

export const useGetLiquidationThresholdPercentage = (
  {
    asset,
    poolComptrollerContractAddress,
  }: { asset: Asset; poolComptrollerContractAddress: string },
  { enabled }: { enabled: boolean },
) => {
  const { chainId } = useChainId();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  const isLegacyCorePoolVToken =
    areAddressesEqual(corePoolComptrollerContractAddress, poolComptrollerContractAddress) &&
    (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET);

  const { data: getIsolatedPoolVTokenLiquidationThresholdData } =
    useGetIsolatedPoolVTokenLiquidationThreshold(
      {
        poolComptrollerContractAddress,
        vTokenAddress: asset.vToken.address,
      },
      {
        enabled: enabled && !isLegacyCorePoolVToken,
      },
    );

  return isLegacyCorePoolVToken
    ? asset.collateralFactor
    : getIsolatedPoolVTokenLiquidationThresholdData?.liquidationThresholdPercentage;
};
