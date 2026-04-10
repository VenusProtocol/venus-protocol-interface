import { Tabs } from 'components';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { YieldPlusPosition } from 'types';
import { IncreaseForm } from './IncreaseForm';

export interface PositionTabsProps {
  position: YieldPlusPosition;
}

export const PositionTabs: React.FC<PositionTabsProps> = ({ position }) => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      title: t('operationForm.managePositionsTabs.positionsTabs.increase'),
      id: 'increase',
      content: <IncreaseForm position={position} />,
    },
  ];

  return <Tabs tabs={tabs} />;
};
