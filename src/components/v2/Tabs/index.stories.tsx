import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { Tabs } from '.';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [withThemeProvider, withCenterStory({ width: 150 })],
} as ComponentMeta<typeof Tabs>;

export const Default = () => (
  <Tabs options={['Borrow', 'Repay']} activeOptionIndex={0} onChange={() => {}} />
);
