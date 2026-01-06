import { cn } from '@venusprotocol/ui';
import { useGetAsset } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { useParams } from 'react-router';
import type { Address } from 'viem';
import { MarketInfo } from './MarketInfo';
import { TopBar } from './TopBar';
import { useIsOnMarketPage } from './useIsOnMarketPage';

export const Header: React.FC = () => {
  const isOnMarketPage = useIsOnMarketPage();

  const { vTokenAddress = NULL_ADDRESS } = useParams<{
    vTokenAddress: Address;
  }>();

  const { data: getAssetData } = useGetAsset({
    vTokenAddress,
  });
  const asset = getAssetData?.asset;

  const { color: gradientAccentColor } = useImageAccentColor({
    imagePath: asset?.vToken.underlyingToken.iconSrc,
  });

  return (
    <header
      className={cn(
        // The gradient will only be visible when a background color is applied. It is built this
        // way to support gradient background using a solid background color
        'relative shrink-0 transition-all duration-500 bg-linear-to-b from-background/60 to-background',
      )}
      style={
        isOnMarketPage && gradientAccentColor
          ? {
              backgroundColor: gradientAccentColor,
            }
          : undefined
      }
    >
      <div className="relative">
        <TopBar />

        {isOnMarketPage && <MarketInfo />}
      </div>
    </header>
  );
};
