import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { Tabs } from '.';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [withCenterStory({ width: 350 })],
} as ComponentMeta<typeof Tabs>;

export const Default = () => <Tabs tabTitles={['Borrow', 'Repay']} onTabChange={console.log} />;

export const FullWidth = () => (
  <Tabs
    tabTitles={['Borrow', 'Repay']}
    initialActiveTabIndex={1}
    onTabChange={console.log}
    fullWidth
  />
);
