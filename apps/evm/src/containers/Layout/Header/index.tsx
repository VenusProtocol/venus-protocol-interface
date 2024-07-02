import { useParams } from 'react-router';

import { useGetAsset } from 'clients/api';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { cn } from 'utilities';
import { MarketInfo } from './MarketInfo';
import { TopBar } from './TopBar';
import { useIsOnMarketPage } from './useIsOnMarketPage';

export const Header: React.FC = () => {
  const isOnMarketPage = useIsOnMarketPage();

  const { vTokenAddress = '' } = useParams();
  const { data: getAssetData } = useGetAsset({
    vTokenAddress,
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
