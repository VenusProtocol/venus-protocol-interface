import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { Tabs } from '.';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [withCenterStory({ width: 650 })],
} as ComponentMeta<typeof Tabs>;

export const Default = () => (
  <Tabs
    tabTitles={['Borrow', 'Repay']}
    tabsContent={[<>first tab content</>, <>second tab content</>]}
  />
);

export const WithTitle = () => (
  <Tabs
    componentTitle="Title"
    tabTitles={['Borrow', 'Repay']}
    tabsContent={[<>first tab content</>, <>second tab content</>]}
  />
);

export const WithTitle = () => <Tabs componentTitle="Title" tabTitles={['Borrow', 'Repay']} />;

export const WithChildren = () => (
  <Tabs
    fullWidth
    tabTitles={['Borrow', 'Repay']}
    tabsContent={[<>first tab content</>, <>second tab content</>]}
  />
);
