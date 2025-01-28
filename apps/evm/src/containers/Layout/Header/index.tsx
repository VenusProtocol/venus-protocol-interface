import { useParams } from 'react-router';

import { useGetAsset } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { cn } from 'utilities';
import type { Address } from 'viem';
import { MarketInfo } from './MarketInfo';
import { TopBar } from './TopBar';
import { useIsOnLidoMarketPage } from './useIsOnLidoMarketPage';
import { useIsOnMarketPage } from './useIsOnMarketPage';

export const Header: React.FC = () => {
  const isOnMarketPage = useIsOnMarketPage();
  const isOnLidoMarketPage = useIsOnLidoMarketPage();
  const { lstPoolVWstEthContractAddress } = useGetChainMetadata();

  const { vTokenAddress = NULL_ADDRESS } = useParams<{
    vTokenAddress: Address;
  }>();

  const { data: getAssetData } = useGetAsset({
    vTokenAddress: isOnLidoMarketPage ? lstPoolVWstEthContractAddress : vTokenAddress,
  });
  const asset = getAssetData?.asset;

  const { color: gradientAccentColor } = useImageAccentColor({
    imagePath: asset?.vToken.underlyingToken.asset,
  });

  return (
    <header
      className={cn(
        // The gradient will only be visible when a background color is applied. It is built this
        // way to support gradient background using a solid background color
        'transition-all duration-500 bg-gradient-to-b from-background/60 to-background',
      )}
      style={
        isOnMarketPage && gradientAccentColor
          ? {
              backgroundColor: gradientAccentColor,
            }
          : undefined
      }
    >
      <TopBar />

      {isOnMarketPage && <MarketInfo />}
    </header>
  );
};
