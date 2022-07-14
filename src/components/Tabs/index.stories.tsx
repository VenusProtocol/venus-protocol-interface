import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { Tabs } from '.';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [withCenterStory({ width: 650 })],
} as ComponentMeta<typeof Tabs>;

const tabsContent = [
  { title: 'Borrow', content: <>first tab content</> },
  { title: 'Repay', content: <>second tab content</> },
];

export const Default = () => <Tabs tabsContent={tabsContent} />;

export const WithTitle = () => <Tabs componentTitle="Title" tabsContent={tabsContent} />;

export const WithInitialSecondTabActive = () => (
  <Tabs initialActiveTabIndex={1} componentTitle="Title" tabsContent={tabsContent} />
);
