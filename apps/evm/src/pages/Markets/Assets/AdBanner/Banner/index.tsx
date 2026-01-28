import { cn } from '@venusprotocol/ui';

import { ButtonWrapper } from 'components';
import { Link } from 'containers/Link';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description: React.ReactNode;
  illustration: React.ReactNode;
  learnMoreUrl: string;
  learnMoreLabel?: string;
  backgroundIllustration?: React.ReactNode;
  contentContainerClassName?: string;
}

export const Banner: React.FC<BannerProps> = ({
  className,
  contentContainerClassName,
  learnMoreUrl,
  learnMoreLabel,
  title,
  description,
  illustration,
  backgroundIllustration,
}) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const textDom = (
    <div className="space-y-0.5">
      <p className="font-semibold text-sm lg:text-base">{title}</p>
      <p className="text-xs lg:text-sm">{description}</p>
    </div>
  );

  return (
    <div
      className={cn(
        'relative rounded-lg h-26.25 px-4 flex items-center sm:pr-3 sm:h-18 lg:pl-6 lg:pr-3',
        className,
      )}
    >
      <div className="absolute inset-0 rounded-lg overflow-hidden">{backgroundIllustration}</div>

      <div className="flex flex-col gap-y-2 relative grow">
        <div className="flex items-center justify-between">
          <div className={cn('flex items-center gap-x-4', contentContainerClassName)}>
            {illustration}

            <div className="hidden sm:block">{textDom}</div>
          </div>

          <ButtonWrapper size={isSmOrUp ? 'md' : 'xs'} asChild>
            <Link
              href={learnMoreUrl}
              target="_blank"
              className="hover:no-underline active:no-underline text-white"
            >
              {learnMoreLabel ?? t('adBanner.startNow')}
            </Link>
          </ButtonWrapper>
        </div>

        <div className="sm:hidden">{textDom}</div>
      </div>
    </div>
  );
};
