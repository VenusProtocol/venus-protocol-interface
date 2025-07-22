import { Card } from 'components';
import { useTranslation } from 'libs/translations';

export const Summary: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <h2 className="mb-6 text-lg">{t('account.summary.title')}</h2>
    </Card>
  );
};
