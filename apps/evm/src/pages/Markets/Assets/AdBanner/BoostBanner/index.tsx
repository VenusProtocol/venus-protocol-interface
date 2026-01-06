import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import rocketIllustration from './rocket.png';

const LEARN_MORE_URL = 'https://docs-v4.venus.io/guides/leveraged-positions';

export const BoostBanner: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <Banner
      className="bg-gradient-to-r from-[#01193A] to-[#0D3CB1]"
      title={<span className="text-offWhite">{t('boostBanner.title')}</span>}
      description={
        <span className="text-grey">
          <Trans
            i18nKey="boostBanner.description"
            components={{
              White: <span className="text-offWhite" />,
            }}
          />
        </span>
      }
      illustration={
        <div className="h-10 w-14 sm:h-12 sm:w-[78px] lg:h-14">
          <img
            src={rocketIllustration}
            alt={t('boostBanner.rocketAltText')}
            className="absolute size-14 -mt-4 sm:-mt-[22px] sm:size-[78px]"
          />
        </div>
      }
      contentContainerClassName="gap-x-1"
      learnMoreUrl={LEARN_MORE_URL}
    />
  );
};
