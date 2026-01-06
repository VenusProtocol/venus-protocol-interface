import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import probaleIcon from './probaleIcon.png';

const LEARN_MORE_URL = 'https://probable.markets';

export const ProbableBanner: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <Banner
      className="bg-gradient-to-r from-[#0E3FB7] from-10% via-[#00193A] via-[70.38%] to-[#001E68] to-[110.07%]"
      title={<span className="text-offWhite">{t('probableBanner.title')}</span>}
      description={
        <span className="text-grey">
          <Trans
            i18nKey="probableBanner.description"
            components={{
              White: <span className="text-offWhite" />,
            }}
          />
        </span>
      }
      illustration={
        <div className="h-10 w-14 sm:h-12 sm:w-[78px] lg:h-14">
          <img
            src={probaleIcon}
            alt={t('probableBanner.probableAltText')}
            className="absolute size-14 -mt-4 sm:-mt-[22px] sm:size-[78px]"
          />
        </div>
      }
      contentContainerClassName="gap-x-1"
      learnMoreUrl={LEARN_MORE_URL}
      learnMoreLabel={t('adBanner.startNow')}
    />
  );
};
