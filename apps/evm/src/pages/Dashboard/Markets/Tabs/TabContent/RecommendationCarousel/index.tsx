import { Carousel, CarouselItem } from 'components';
import type { Asset } from 'types';
import { Recommendation, type RecommendationProps } from './Recommendation';

export interface RecommendationCarouselProps
  extends Pick<RecommendationProps, 'type' | 'poolComptrollerContractAddress'> {
  assets: Asset[];
  className?: string;
}

export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({
  type,
  className,
  poolComptrollerContractAddress,
  assets,
}) => (
  <Carousel
    autoPlay
    className={className}
    trackerClassName="absolute bottom-4 left-0 right-0 sm:bottom-auto sm:top-2 sm:right-4 sm:left-auto"
  >
    {assets.map(asset => (
      <CarouselItem key={`${type}-${asset.vToken.address}`}>
        <Recommendation
          asset={asset}
          poolComptrollerContractAddress={poolComptrollerContractAddress}
          type={type}
        />
      </CarouselItem>
    ))}
  </Carousel>
);
