import { ButtonGroup, Select, type SelectOption } from 'components';
import { VENUS_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import { type Tab, useTabs } from 'hooks/useTabs';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import { EMode } from './EMode';
import { Markets } from './Markets';
import { formatEModeGroups } from './formatEModeGroups';
import type { ExtendedEModeGroup } from './types';

export interface TabsProps {
  pool: Pool;
}

const E_MODE_DOC_URL = `${VENUS_DOC_URL}/whats-new/emode`;
const ISOLATION_MODE_DOC_URL = ''; // TODO: add

export const Tabs: React.FC<TabsProps> = ({ pool }) => {
  const { t, Trans } = useTranslation();

  const { formatTo } = useFormatTo();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const extendedEModeGroups = formatEModeGroups({
    pool,
    vai,
    formatTo,
  });

  const isolatedEModeGroups: ExtendedEModeGroup[] = [];
  const eModeGroups: ExtendedEModeGroup[] = [];

  extendedEModeGroups.forEach(
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
        <EMode
          pool={pool}
          notice={
            <Trans
              i18nKey="markets.tabs.eMode.eModeNotice"
              components={{
                Link: <Link href={E_MODE_DOC_URL} />,
              }}
            />
          }
          extendedEModeGroups={eModeGroups}
        />
      ),
    });
  }

  if (isolatedEModeGroups.length > 0) {
    tabs.push({
      title: t('markets.tabs.isolationMode.label'),
      id: 'isolation-mode',
      content: (
        <EMode
          pool={pool}
          notice={
            <Trans
              i18nKey="markets.tabs.eMode.isolationModeNotice"
              components={{
                Link: <Link href={ISOLATION_MODE_DOC_URL} />,
              }}
            />
          }
          extendedEModeGroups={isolatedEModeGroups}
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
