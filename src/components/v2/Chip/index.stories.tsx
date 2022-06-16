import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { Chip } from '.';

export default {
  title: 'Components/Chip',
  component: Chip,
  decorators: [withThemeProvider, withCenterStory({ width: 200 })],
} as ComponentMeta<typeof Chip>;

export const Default = () => <Chip text="Some text" />;

export const Custom = () => (
  <Chip
    text="Some text"
    backgroundColor="rgba(24, 223, 139, 0.5)"
    textColor="rgba(24, 223, 139, 1)"
  />
);
