import { useGetPrimeToken } from 'clients/api';
import { Carousel, CarouselItem } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';
import { PrimePromotionalBanner } from './PrimePromotionalBanner';

export const Banner: React.FC = () => {
  const { accountAddress } = useAccountAddress();

  const { data: getPrimeTokenData } = useGetPrimeToken({
    accountAddress,
  });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const slides: React.ReactNode[] = [];

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
