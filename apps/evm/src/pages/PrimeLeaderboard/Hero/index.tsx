import { useTranslation } from 'libs/translations';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center gap-y-2 pt-2 text-center">
      <h1 className="text-p1s text-white sm:text-h6">{t('primeLeaderboard.title')}</h1>

      <p className="text-b1s text-light-grey sm:text-p3s">{t('primeLeaderboard.description')}</p>
    </div>
  );
};
