import { cn } from '@venusprotocol/ui';
import { useGetAsset, useGetLiquidityHub } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { useParams } from 'react-router';
import type { Address } from 'viem';
import { AssetInfo } from './AssetInfo';
import { Breadcrumbs } from './Breadcrumbs';
import { LiquidityHubInfo } from './LiquidityHubInfo';
import { usePathNodes } from './usePathNodes';

export const Header: React.FC = () => {
  const currentRoutePath = useGetCurrentRoutePath();
  const isOnMarketPage = currentRoutePath === routes.market.path;
  const isOnLiquidityHubPage = currentRoutePath === routes.liquidityHub.path;

  const { vTokenAddress = NULL_ADDRESS, vhTokenAddress = NULL_ADDRESS } = useParams<{
    vTokenAddress?: Address;
    vhTokenAddress?: Address;
  }>();

  const { data: getAssetData } = useGetAsset({
    vTokenAddress,
  });
  const asset = getAssetData?.asset;

  const { data: getLiquidityHubData } = useGetLiquidityHub(
    {
      vhTokenAddress: vhTokenAddress || NULL_ADDRESS,
    },
    {
      enabled: !!vhTokenAddress,
    },
  );
  const liquidityHub = getLiquidityHubData?.liquidityHub;

  const imagePath =
    asset?.vToken.underlyingToken.iconSrc ?? liquidityHub?.vhToken.underlyingToken.iconSrc;

  const { color: gradientAccentColor } = useImageAccentColor({
    imagePath,
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
        gradientAccentColor
          ? {
              backgroundColor: gradientAccentColor,
            }
          : undefined
      }
    >
      <div className="relative">
        <div className="space-y-6 sm:space-y-8">
          {pathNodes.length > 1 && <Breadcrumbs pathNodes={pathNodes} className="pt-5 sm:pt-10" />}

          {isOnMarketPage && <AssetInfo />}

          {isOnLiquidityHubPage && <LiquidityHubInfo />}
        </div>
      </div>
    </header>
  );
};
