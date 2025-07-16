import { cn } from '@venusprotocol/ui';
import { useGetAsset } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { useIsOnUnichain } from 'hooks/useIsOnUnichain';
import { useTranslation } from 'libs/translations';
import { useParams } from 'react-router';
import type { Address } from 'viem';
import { MarketInfo } from './MarketInfo';
import { TopBar } from './TopBar';
import unichainBackgroundIllustration from './unichainBackground.svg';
import { useIsOnMarketPage } from './useIsOnMarketPage';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const isOnMarketPage = useIsOnMarketPage();
  const isOnUnichain = useIsOnUnichain();

  const { vTokenAddress = NULL_ADDRESS } = useParams<{
    vTokenAddress: Address;
  }>();

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
        'relative flex-shrink-0 transition-all duration-500 bg-gradient-to-b from-background/60 to-background',
      )}
      style={
        isOnMarketPage && gradientAccentColor
          ? {
              backgroundColor: gradientAccentColor,
            }
          : undefined
      }
    >
      {isOnUnichain && !isOnMarketPage && (
        <img
          src={unichainBackgroundIllustration}
          alt={t('layout.header.unichainBackgroundIllustrationAlt')}
          className="absolute top-0 left-0 max-w-none w-92 sm:w-114 md:w-130 md:-top-2"
        />
      )}

      <div className="relative">
        <TopBar />

        {isOnMarketPage && <MarketInfo />}
      </div>
    </header>
  );
};
