import { cn } from '@venusprotocol/ui';
import type { To } from 'react-router';

import { ButtonWrapper } from 'components';
import { Link } from 'containers/Link';

export interface BannerProps {
  title: string;
  description: string;
  buttonLabel: string;
  children?: React.ReactNode;
  to?: To;
  href?: string;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  className,
  title,
  description,
  buttonLabel,
  to,
  href,
  children,
}) => (
  <div
    className={cn(
      'relative rounded-2xl overflow-hidden p-4 h-63 @min-[357px]:p-6 @min-[357px]:h-100 @min-[576px]:h-45 @min-[576px]:items-center @min-[1120px]:h-50',
      className,
    )}
  >
    <div className="absolute size-full inset-0">{children}</div>

    <div className="relative max-w-64 @min-[357px]:max-w-86 @min-[357px]:pr-7 @min-[576px]:max-w-none">
      <p className="text-p2s mb-2">{title}</p>

      <p className="mb-3 text-light-grey @min-[357px]:mb-6 ">{description}</p>

      <ButtonWrapper size="xs" asChild>
        <Link to={to} href={href} noStyle>
          {buttonLabel}
        </Link>
      </ButtonWrapper>
    </div>
  </div>
);
