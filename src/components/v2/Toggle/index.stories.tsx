import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { Toggle } from '.';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as ComponentMeta<typeof Toggle>;

export const Default = () => <Toggle onChange={console.log} />;
