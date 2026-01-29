import { cn } from '@venusprotocol/ui';
import { useGetAsset } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { useParams } from 'react-router';
import type { Address } from 'viem';
import { Breadcrumbs } from './Breadcrumbs';
import { MarketInfo } from './MarketInfo';
import { useIsOnMarketPage } from './useIsOnMarketPage';
import { usePathNodes } from './usePathNodes';

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

  const pathNodes = usePathNodes();

  if (pathNodes.length <= 1 && !isOnMarketPage) {
    return undefined;
  }

  return (
    <header
      className={cn(
        // The gradient will only be visible when a background color is applied. It is built this
        // way to support gradient background using a solid background color
        'relative shrink-0 pt-10 -mt-10 transition-all duration-500 bg-linear-to-b from-background/60 to-background',
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
        <div className="space-y-6 sm:space-y-8">
          {pathNodes.length > 1 && <Breadcrumbs pathNodes={pathNodes} />}

          {isOnMarketPage && <MarketInfo />}
        </div>
      </div>
    </header>
  );
};
