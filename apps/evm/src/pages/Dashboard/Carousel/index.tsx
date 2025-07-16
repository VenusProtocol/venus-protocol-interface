import { useGetPrimeToken } from 'clients/api';
import { Carousel as CarouselComp, CarouselItem } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { BurnedWBnbBanner } from './BurnedWBnbBanner';
import { PrimePromotionalBanner } from './PrimePromotionalBanner';

export const Carousel: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();

  const { data: getPrimeTokenData } = useGetPrimeToken({
    accountAddress,
  });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const slides: React.ReactNode[] = [];

  if (chainId === ChainId.BSC_MAINNET) {
    slides.push(<BurnedWBnbBanner />);
  }

  if (isPrimeEnabled && (!isAccountPrime || !accountAddress)) {
    slides.push(<PrimePromotionalBanner />);
  }

  return slides.length > 0 ? (
    <CarouselComp className="mb-6" autoPlay>
      {slides.map((slide, i) => (
        <CarouselItem key={i}>{slide}</CarouselItem>
      ))}
    </CarouselComp>
  ) : undefined;
};
