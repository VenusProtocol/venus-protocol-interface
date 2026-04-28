import { cn } from '@venusprotocol/ui';

import { Card, Icon } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import illustrationSrc from './illustration.png';
import { store } from './store';

const LEARN_MORE_URL = ''; // TODO: add

export interface BannerProps {
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ className }) => {
  const { t } = useTranslation();

  const hideBanner = store.use.hideBanner();

  return (
    <Card className={cn('h-21 relative bg-dark-blue-active items-center flex p-6', className)}>
      <img
        src={illustrationSrc}
        className="h-18 absolute bottom-0 right-2 sm:h-22 sm:right-12 md:h-24 md:right-14 lg:h-19 lg:right-3 2xl:right-6"
        alt={t('trade.banner.illustrationAltText')}
      />

      <div className="flex flex-col gap-y-">
        <p className="text-b1s">{t('trade.banner.title')}</p>

        <Link className="text-b1s" href={LEARN_MORE_URL}>
          {t('trade.banner.learnMore')}
        </Link>
      </div>

      <button
        onClick={hideBanner}
        type="button"
        className="absolute top-0 right-0 p-2 cursor-pointer"
      >
        <Icon name="closeRounded" className="size-3" />
      </button>
    </Card>
  );
};
