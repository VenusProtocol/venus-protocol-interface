import { useParams } from 'react-router';

import { useGetAsset } from 'clients/api';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { cn } from 'utilities';
import { MarketInfo } from './MarketInfo';
import { TopBar } from './TopBar';
import { useIsOnMarketPage } from './useIsOnMarketPage';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

export const Header: React.FC = () => {
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });
  const isOnMarketPage = useIsOnMarketPage();
  const shouldUseNewMarketFeature = isNewMarketPageEnabled && isOnMarketPage;

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
        shouldUseNewMarketFeature && gradientAccentColor
          ? {
              backgroundColor: gradientAccentColor,
            }
          : undefined
      }
    >
      <TopBar />

      {shouldUseNewMarketFeature && <MarketInfo />}
    </header>
  );
};
