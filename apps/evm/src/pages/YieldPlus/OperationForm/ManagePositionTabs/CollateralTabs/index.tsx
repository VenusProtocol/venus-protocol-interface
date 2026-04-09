import { Tabs } from 'components';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { YieldPlusPosition } from 'types';
import { SupplyForm } from './SupplyForm';
import { WithdrawForm } from './WithdrawForm';

export interface CollateralTabsProps {
  position: YieldPlusPosition;
}

export const CollateralTabs: React.FC<CollateralTabsProps> = ({ position }) => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      title: t('operationForm.managePositionsTabs.positionsTabs.supply'),
      id: 'supply',
      content: <SupplyForm position={position} />,
    },
    {
      title: t('operationForm.managePositionsTabs.positionsTabs.withdraw'),
      id: 'withdraw',
      content: <WithdrawForm position={position} />,
    },
  ];

  return <Tabs tabs={tabs} />;
};
