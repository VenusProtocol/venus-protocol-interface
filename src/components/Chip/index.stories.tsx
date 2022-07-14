import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { ActiveChip, BlueChip, Chip, ErrorChip, InactiveChip } from '.';

export default {
  title: 'Components/Chip',
  component: Chip,
  decorators: [withThemeProvider, withCenterStory({ width: 200 })],
} as ComponentMeta<typeof Chip>;

export const Default = () => <Chip text="Some text" />;

export const Active = () => <ActiveChip text="Some text" />;

export const Inactive = () => <InactiveChip text="Some text" />;

export const Blue = () => <BlueChip text="Some text" />;

export const Error = () => <ErrorChip text="Some text" />;
