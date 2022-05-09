import React from 'react';

import { ComponentMeta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { ApyChart, IItem } from '.';

const data: IItem[] = [
  {
    apy: 40,
    timestamp: new Date('2022-05-03T10:59:44.330Z'),
  },
  {
    apy: 30,
    timestamp: new Date('2022-05-04T10:59:44.330Z'),
  },
  {
    apy: 20,
    timestamp: new Date('2022-05-05T10:59:44.330Z'),
  },
  {
    apy: 27,
    timestamp: new Date('2022-05-06T10:59:44.330Z'),
  },
  {
    apy: 18,
    timestamp: new Date('2022-05-07T10:59:44.330Z'),
  },
  {
    apy: 23,
    timestamp: new Date('2022-05-08T10:59:44.330Z'),
  },
  {
    apy: 34,
    timestamp: new Date('2022-05-09T10:59:44.330Z'),
  },
];

export default {
  title: 'Components/ApyChart',
  component: ApyChart,
  decorators: [withThemeProvider, withCenterStory({ width: 700 })],
} as ComponentMeta<typeof ApyChart>;

export const Default = () => <ApyChart data={data} />;
