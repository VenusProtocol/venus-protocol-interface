import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useEffect, useState } from 'react';

import bannerImgSrc from './whatsYieldBanner.png';

const BANNER_DISMISSED_KEY = 'yieldPlus.bannerDismissed';

export interface YieldPlusBannerProps {
  className?: string;
}

export const YieldPlusBanner: React.FC<YieldPlusBannerProps> = ({ className }) => {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative flex items-center bg-dark-blue-active border border-dark-blue-hover rounded-lg overflow-hidden',
        className,
      )}
    >
      {/* Text content - single line */}
      <div className="flex items-center px-6 py-4 relative z-10 flex-1 min-w-0">
        <p className="text-b1s text-white whitespace-nowrap">
          {t('yieldPlus.banner.title')}{' '}
          <button
            type="button"
            className="text-b1s text-blue underline hover:text-blue/80 transition-colors cursor-pointer"
          >
            {t('yieldPlus.banner.link')}
          </button>
        </p>
      </div>

      {/* Banner illustration */}
      <img
        src={bannerImgSrc}
        alt=""
        className="absolute right-8 top-0 h-full w-auto object-contain pointer-events-none"
      />

      {/* Close button - top right */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="absolute top-2 right-2 z-10 text-grey hover:text-white transition-colors"
      >
        <Icon name="close" className="size-4" />
      </button>
    </div>
  );
};
