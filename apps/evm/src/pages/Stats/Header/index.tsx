import { useTranslation } from 'libs/translations';
import illustrationSrc from './illustration.png';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative pt-12">
      <h1 className="text-[32px] font-semibold leading-[1.5] text-light-grey-active">
        {t('statsPage.title')}
      </h1>
      <p className="text-base leading-[1.5] text-white">{t('statsPage.subtitle')}</p>

      <img
        src={illustrationSrc}
        alt={t('statsPage.illustrationAlt')}
        className="absolute right-0 top-2 hidden h-[135px] w-[240px] md:block"
      />
    </div>
  );
};
