import { useGetPrimeToken } from 'clients/api';
import { Carousel, CarouselItem } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { PrimePromotionalBanner } from './PrimePromotionalBanner';
import { UnichainPromotionalBanner } from './UnichainPromotionalBanner';

export const Banner: React.FC = () => {
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

  if (chainId !== ChainId.UNICHAIN_MAINNET && chainId !== ChainId.UNICHAIN_SEPOLIA) {
    slides.push(<UnichainPromotionalBanner />);
  }

  if (isPrimeEnabled && (!isAccountPrime || !accountAddress)) {
    slides.push(<PrimePromotionalBanner />);
  }

  return slides.length > 0 ? (
    <Carousel className="mb-6" autoPlay>
      {slides.map((slide, i) => (
        <CarouselItem key={i}>{slide}</CarouselItem>
      ))}
    </Carousel>
  ) : undefined;
};
