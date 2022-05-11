import React from 'react';

import { ComponentMeta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { InterestRateChart, IItem } from '.';

const data: IItem[] = [
  {
    utilizationRate: 0,
    borrowApyPercentage: 0,
    supplyApyPercentage: 0,
  },
  {
    utilizationRate: 10,
    borrowApyPercentage: 0.1,
    supplyApyPercentage: 0.3,
  },
  {
    utilizationRate: 20,
    borrowApyPercentage: 0.2,
    supplyApyPercentage: 0.4,
  },
  {
    utilizationRate: 30,
    borrowApyPercentage: 0.3,
    supplyApyPercentage: 0.5,
  },
];

export default {
  title: 'Components/InterestRateChart',
  component: InterestRateChart,
  decorators: [withThemeProvider, withCenterStory({ width: 700 })],
} as ComponentMeta<typeof InterestRateChart>;

export const Default = () => <InterestRateChart data={data} />;
