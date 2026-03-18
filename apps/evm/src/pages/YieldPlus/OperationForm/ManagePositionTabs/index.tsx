import { Tabs } from 'components';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { YieldPlusPosition } from 'types';
import { CollateralTabs } from './CollateralTabs';
import { PositionTabs } from './PositionTabs';

export interface ManagePositionTabs {
  position: YieldPlusPosition;
}

export const ManagePositionTabs: React.FC<ManagePositionTabs> = ({ position }) => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      title: t('operationForm.managePositionsTabs.position'),
      id: 'position',
      content: <PositionTabs position={position} />,
    },
    {
      title: t('operationForm.managePositionsTabs.collateral'),
      id: 'collateral',
      content: <CollateralTabs position={position} />,
    },
  ];

  return <Tabs tabs={tabs} variant="secondary" />;
};
