import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { ActiveChip, Chip } from '.';

export default {
  title: 'Components/Chip',
  component: Chip,
  decorators: [withThemeProvider, withCenterStory({ width: 200 })],
} as ComponentMeta<typeof Chip>;

export const Default = () => <Chip text="Some text" />;

export const Active = () => <ActiveChip text="Some text" />;
