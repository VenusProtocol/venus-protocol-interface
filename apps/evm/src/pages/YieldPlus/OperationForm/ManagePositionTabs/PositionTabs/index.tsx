import { Tabs } from 'components';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { YieldPlusPosition } from 'types';
import { ReduceForm } from '../../../ReduceForm';
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
    {
      title: t('operationForm.managePositionsTabs.positionsTabs.reduce'),
      id: 'reduce',
      content: <ReduceForm position={position} />,
    },
  ];

  return <Tabs tabs={tabs} />;
};
