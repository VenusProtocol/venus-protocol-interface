import { cn } from '@venusprotocol/ui';
import { type InputHTMLAttributes, useState } from 'react';

import lightningIllustrationSrc from 'assets/img/lightning.svg';
import { Icon, type Tag, TagGroup, TextField } from 'components';
import { type Tab, useTabs } from 'hooks/useTabs';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import { Assets } from '../Assets';
import { EMode } from './EMode';

export interface TabsProps {
  pool: Pool;
}

export const Tabs: React.FC<TabsProps> = ({ pool }) => {
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    setSearchValue(changeEvent.currentTarget.value);

  const tabs: Tab[] = [
    {
      title: t('markets.tabs.assets.title'),
      id: 'assets',
      content: <Assets pool={pool} />,
    },
    {
      title: t('markets.tabs.eMode.title'),
      id: 'e-mode',
      content: <EMode pool={pool} searchValue={searchValue} onSearchValueChange={setSearchValue} />,
    },
  ];

  const { activeTab, setActiveTab } = useTabs({
    tabs,
    navType: 'searchParam',
  });

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab.id);

  const tags: Tag[] = tabs.map((tab, index) => ({
    id: tab.id,
    content: (
      <div className="flex items-center gap-x-1">
        {tab.id === 'e-mode' && (
          <div
            className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center',
              activeTabIndex === index ? 'bg-offWhite' : 'bg-lightGrey',
            )}
          >
            {activeTabIndex === index ? (
              <Icon name="lightning2" className="text-blue h-3" />
            ) : (
              <img
                src={lightningIllustrationSrc}
                className="h-3"
                alt={t('markets.tabs.eMode.illustrationAltText')}
              />
            )}
          </div>
        )}

        <div className="flex items-baseline gap-x-1">
          <span>{tab.title}</span>
        </div>
      </div>
    ),
    className: tab.id === 'e-mode' ? 'pl-2 pr-3' : undefined,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-6 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:h-10">
        <TagGroup
          tags={tags}
          activeTagIndex={activeTabIndex}
          onTagClick={tagIndex => {
            if (tagIndex === activeTabIndex) {
              return;
            }

            const newActiveTabId = tabs[tagIndex].id;

            if (newActiveTabId === 'e-mode') {
              captureAnalyticEvent('e_mode_navigation', {
                variant: 'pool_tab',
              });
            }

            setActiveTab({
              id: newActiveTabId,
            });
          }}
        />

        {activeTab.id === 'e-mode' && (
          <TextField
            className="hidden w-60 sm:block"
            size="xs"
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder={t('markets.eMode.search.placeholder')}
            leftIconSrc="magnifier"
            variant="secondary"
          />
        )}
      </div>

      {activeTab.content}
    </div>
  );
};
