import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import illustration from './illustration.png';

const LEARN_MORE_URL = 'https://community.venus.io/t/isolated-pools-sunset/5603';

export const IsolatedPoolsSunsetBanner: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <Banner
      className="bg-gradient-to-r from-[#01193A] to-[#0D3CB1]"
      title={<span className="text-white">{t('isolatedPoolsSunsetBanner.title')}</span>}
      description={
        <span className="text-grey">
          <Trans
            i18nKey="isolatedPoolsSunsetBanner.description"
            components={{
              White: <span className="text-white" />,
            }}
          />
        </span>
      }
      illustration={
        <div className="h-10 w-20 sm:h-12 sm:w-[90px] lg:h-14">
          <img
            src={illustration}
            alt={t('isolatedPoolsSunsetBanner.illustrationAltText')}
            className="absolute w-20 -mt-5 -ml-3 sm:-mt-5 sm:w-[98px] lg:-mt-[14px]"
          />
        </div>
      }
      contentContainerClassName="gap-x-1"
      learnMoreUrl={LEARN_MORE_URL}
    />
  );
};
