import { useTranslation } from 'libs/translations';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center pt-2 text-center">
      <h1 className="venus-page-title">{t('primeLeaderboard.title')}</h1>

      <p className="venus-page-subtitle">{t('primeLeaderboard.description')}</p>
    </div>
  );
};
