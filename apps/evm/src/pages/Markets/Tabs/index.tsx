import { ButtonGroup, Select, type SelectOption } from 'components';
import { VENUS_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { type Tab, useTabs } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { EModeGroup, Pool } from 'types';
import { EModeTabContent } from './EModeTabContent';
import { Markets } from './Markets';

const E_MODE_DOC_URL = `${VENUS_DOC_URL}/whats-new/e-mode`;
const ISOLATION_MODE_DOC_URL = `${VENUS_DOC_URL}/whats-new/isolated-e-mode`;

export interface TabsProps {
  pool: Pool;
}

export const Tabs: React.FC<TabsProps> = ({ pool }) => {
  const { t, Trans } = useTranslation();

  const isolatedEModeGroups: EModeGroup[] = [];
  const eModeGroups: EModeGroup[] = [];

  pool.eModeGroups.forEach(
    group => (group.isIsolated ? isolatedEModeGroups.push(group) : eModeGroups.push(group)),
    [],
  );

  const tabs: Tab[] = [
    {
      title: t('markets.tabs.markets.label'),
      id: 'markets',
      content: <Markets pool={pool} />,
    },
  ];

  if (eModeGroups.length > 0) {
    tabs.push({
      title: t('markets.tabs.eMode.label'),
      id: 'e-mode',
      content: (
        <EModeTabContent
          pool={pool}
          eModeGroups={eModeGroups}
          notice={
            <Trans
              i18nKey="markets.tabs.eMode.eModeNotice"
              components={{
                Link: <Link href={E_MODE_DOC_URL} />,
              }}
            />
          }
        />
      ),
    });
  }

  if (isolatedEModeGroups.length > 0) {
    tabs.push({
      title: t('markets.tabs.isolationMode.label'),
      id: 'isolation-mode',
      content: (
        <EModeTabContent
          pool={pool}
          eModeGroups={isolatedEModeGroups}
          notice={
            <Trans
              i18nKey="markets.tabs.eMode.isolationModeNotice"
              components={{
                Link: <Link href={ISOLATION_MODE_DOC_URL} />,
              }}
            />
          }
        />
      ),
    });
  }

  const { activeTab, setActiveTab } = useTabs({
    tabs,
    navType: 'searchParam',
  });

  const selectOptions: SelectOption[] = tabs.map(tab => ({
    label: tab.title,
    value: tab.id,
  }));

  return (
    <div className="space-y-6">
      {tabs.length > 1 && (
        <div>
          <Select
            className="sm:hidden"
            options={selectOptions}
            value={activeTab.id}
            onChange={id => setActiveTab({ id: id as string })}
          />

          <ButtonGroup
            className="hidden w-auto sm:inline-flex"
            buttonSize="sm"
            variant="secondary"
            buttonLabels={tabs.map(({ title }) => title)}
            activeButtonIndex={tabs.findIndex(tab => activeTab.id === tab.id)}
            onButtonClick={index => setActiveTab(tabs[index])}
          />
        </div>
      )}

      {activeTab.content}
    </div>
  );
};
