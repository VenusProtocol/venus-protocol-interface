import { Card } from 'components';
import { useTranslation } from 'libs/translations';
import { TopWalletsTable } from './TopWalletsTable';

export const TopWallets: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="p-4 sm:p-6">
        <h2 className="text-h6 text-white mb-4">{t('statsPage.topWallets.topSuppliers')}</h2>
        <TopWalletsTable kind="suppliers" />
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-h6 text-white mb-4">{t('statsPage.topWallets.topBorrowers')}</h2>
        <TopWalletsTable kind="borrowers" />
      </Card>
    </div>
  );
};
