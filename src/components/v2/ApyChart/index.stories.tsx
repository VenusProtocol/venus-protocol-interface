import React from 'react';

import { ComponentMeta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { ApyChart } from '.';

export default {
  title: 'Components/ApyChart',
  component: ApyChart,
  decorators: [withThemeProvider, withCenterStory({ width: 700 })],
} as ComponentMeta<typeof ApyChart>;

export const Default = () => <ApyChart />;
