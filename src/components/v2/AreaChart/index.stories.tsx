import React from 'react';

import { ComponentMeta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { AreaChart } from '.';

export default {
  title: 'Components/AreaChart',
  component: AreaChart,
  decorators: [withThemeProvider, withCenterStory({ width: 700 })],
} as ComponentMeta<typeof AreaChart>;

export const Default = () => <AreaChart />;
