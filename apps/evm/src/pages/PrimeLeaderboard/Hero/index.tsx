import { useTranslation } from 'libs/translations';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center gap-y-2 pt-2 text-center">
      <h1 className="text-h6 text-white">{t('primeLeaderboard.title')}</h1>

      <p className="text-p3s text-light-grey">{t('primeLeaderboard.description')}</p>
    </div>
  );
};
