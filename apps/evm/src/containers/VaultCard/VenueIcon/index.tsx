import { cn } from '@venusprotocol/ui';

export interface VenueIconProps {
  src: string;
  alt: string;
  isMonochrome: boolean;
  className?: string;
}

export const VenueIcon: React.FC<VenueIconProps> = ({ src, alt, isMonochrome, className }) => (
  <span
    className={cn(
      'inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border-[0.5px]',
      isMonochrome ? 'border-logo-tile bg-logo-tile' : 'border-venus-core-tile bg-venus-core-tile',
      className,
    )}
  >
    {isMonochrome ? (
      <span
        role="img"
        aria-label={alt}
        className="size-[65%] bg-current text-primary mask-contain mask-center mask-no-repeat"
        style={{ maskImage: `url("${src}")` }}
      />
    ) : (
      <img src={src} alt={alt} className="size-[65%] object-contain" />
    )}
  </span>
);
