import { Page } from 'components';
import { useTranslation } from 'libs/translations';

const PrimeLeaderboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <div className="flex flex-col items-center gap-2 pt-12 text-center">
        <h1 className="text-h6 text-white">{t('primeLeaderboard.title')}</h1>

        <p className="text-p3s text-light-grey">{t('primeLeaderboard.description')}</p>
      </div>
    </Page>
  );
};

export default PrimeLeaderboard;
