import React from 'react';

import { ComponentMeta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { InterestRateChart, IInterestRateItem } from '.';

const data: IInterestRateItem[] = [
  {
    borrowApyPercentage: 0.04,
    supplyApyPercentage: 0,
    utilizationPercentage: 1,
  },
  {
    borrowApyPercentage: 0.09,
    supplyApyPercentage: 0,
    utilizationPercentage: 2,
  },
  {
    borrowApyPercentage: 0.14,
    supplyApyPercentage: 0,
    utilizationPercentage: 3,
  },
  {
    borrowApyPercentage: 0.19,
    supplyApyPercentage: 0,
    utilizationPercentage: 4,
  },
  {
    borrowApyPercentage: 0.24,
    supplyApyPercentage: 0.01,
    utilizationPercentage: 5,
  },
  {
    borrowApyPercentage: 0.29,
    supplyApyPercentage: 0.01,
    utilizationPercentage: 6,
  },
  {
    borrowApyPercentage: 0.34,
    supplyApyPercentage: 0.02,
    utilizationPercentage: 7.000000000000001,
  },
  {
    borrowApyPercentage: 0.39,
    supplyApyPercentage: 0.02,
    utilizationPercentage: 8,
  },
  {
    borrowApyPercentage: 0.44,
    supplyApyPercentage: 0.03,
    utilizationPercentage: 9,
  },
  {
    borrowApyPercentage: 0.49,
    supplyApyPercentage: 0.04,
    utilizationPercentage: 10,
  },
  {
    borrowApyPercentage: 0.54,
    supplyApyPercentage: 0.05,
    utilizationPercentage: 11,
  },
  {
    borrowApyPercentage: 0.6,
    supplyApyPercentage: 0.06,
    utilizationPercentage: 12,
  },
  {
    borrowApyPercentage: 0.65,
    supplyApyPercentage: 0.07,
    utilizationPercentage: 13,
  },
  {
    borrowApyPercentage: 0.7,
    supplyApyPercentage: 0.08,
    utilizationPercentage: 14.000000000000002,
  },
  {
    borrowApyPercentage: 0.75,
    supplyApyPercentage: 0.1,
    utilizationPercentage: 15,
  },
  {
    borrowApyPercentage: 0.8,
    supplyApyPercentage: 0.11,
    utilizationPercentage: 16,
  },
  {
    borrowApyPercentage: 0.85,
    supplyApyPercentage: 0.12,
    utilizationPercentage: 17,
  },
  {
    borrowApyPercentage: 0.9,
    supplyApyPercentage: 0.14,
    utilizationPercentage: 18,
  },
  {
    borrowApyPercentage: 0.95,
    supplyApyPercentage: 0.16,
    utilizationPercentage: 19,
  },
  {
    borrowApyPercentage: 1,
    supplyApyPercentage: 0.17,
    utilizationPercentage: 20,
  },
  {
    borrowApyPercentage: 1.05,
    supplyApyPercentage: 0.19,
    utilizationPercentage: 21,
  },
  {
    borrowApyPercentage: 1.1,
    supplyApyPercentage: 0.21,
    utilizationPercentage: 22,
  },
  {
    borrowApyPercentage: 1.15,
    supplyApyPercentage: 0.23,
    utilizationPercentage: 23,
  },
  {
    borrowApyPercentage: 1.2,
    supplyApyPercentage: 0.25,
    utilizationPercentage: 24,
  },
  {
    borrowApyPercentage: 1.25,
    supplyApyPercentage: 0.28,
    utilizationPercentage: 25,
  },
  {
    borrowApyPercentage: 1.3,
    supplyApyPercentage: 0.3,
    utilizationPercentage: 26,
  },
  {
    borrowApyPercentage: 1.35,
    supplyApyPercentage: 0.32,
    utilizationPercentage: 27,
  },
  {
    borrowApyPercentage: 1.4,
    supplyApyPercentage: 0.35,
    utilizationPercentage: 28.000000000000004,
  },
  {
    borrowApyPercentage: 1.45,
    supplyApyPercentage: 0.37,
    utilizationPercentage: 28.999999999999996,
  },
  {
    borrowApyPercentage: 1.5,
    supplyApyPercentage: 0.4,
    utilizationPercentage: 30,
  },
  {
    borrowApyPercentage: 1.55,
    supplyApyPercentage: 0.43,
    utilizationPercentage: 31,
  },
  {
    borrowApyPercentage: 1.6,
    supplyApyPercentage: 0.46,
    utilizationPercentage: 32,
  },
  {
    borrowApyPercentage: 1.65,
    supplyApyPercentage: 0.48,
    utilizationPercentage: 33,
  },
  {
    borrowApyPercentage: 1.7,
    supplyApyPercentage: 0.52,
    utilizationPercentage: 34,
  },
  {
    borrowApyPercentage: 1.76,
    supplyApyPercentage: 0.55,
    utilizationPercentage: 35,
  },
  {
    borrowApyPercentage: 1.81,
    supplyApyPercentage: 0.58,
    utilizationPercentage: 36,
  },
  {
    borrowApyPercentage: 1.86,
    supplyApyPercentage: 0.61,
    utilizationPercentage: 37,
  },
  {
    borrowApyPercentage: 1.91,
    supplyApyPercentage: 0.65,
    utilizationPercentage: 38,
  },
  {
    borrowApyPercentage: 1.96,
    supplyApyPercentage: 0.68,
    utilizationPercentage: 39,
  },
  {
    borrowApyPercentage: 2.01,
    supplyApyPercentage: 0.72,
    utilizationPercentage: 40,
  },
  {
    borrowApyPercentage: 2.06,
    supplyApyPercentage: 0.75,
    utilizationPercentage: 41,
  },
  {
    borrowApyPercentage: 2.11,
    supplyApyPercentage: 0.79,
    utilizationPercentage: 42,
  },
  {
    borrowApyPercentage: 2.16,
    supplyApyPercentage: 0.83,
    utilizationPercentage: 43,
  },
  {
    borrowApyPercentage: 2.21,
    supplyApyPercentage: 0.87,
    utilizationPercentage: 44,
  },
  {
    borrowApyPercentage: 2.26,
    supplyApyPercentage: 0.91,
    utilizationPercentage: 45,
  },
  {
    borrowApyPercentage: 2.32,
    supplyApyPercentage: 0.95,
    utilizationPercentage: 46,
  },
  {
    borrowApyPercentage: 2.37,
    supplyApyPercentage: 0.99,
    utilizationPercentage: 47,
  },
  {
    borrowApyPercentage: 2.42,
    supplyApyPercentage: 1.03,
    utilizationPercentage: 48,
  },
  {
    borrowApyPercentage: 2.47,
    supplyApyPercentage: 1.08,
    utilizationPercentage: 49,
  },
  {
    borrowApyPercentage: 2.52,
    supplyApyPercentage: 1.12,
    utilizationPercentage: 50,
  },
  {
    borrowApyPercentage: 2.57,
    supplyApyPercentage: 1.17,
    utilizationPercentage: 51,
  },
  {
    borrowApyPercentage: 2.62,
    supplyApyPercentage: 1.22,
    utilizationPercentage: 52,
  },
  {
    borrowApyPercentage: 2.67,
    supplyApyPercentage: 1.26,
    utilizationPercentage: 53,
  },
  {
    borrowApyPercentage: 2.72,
    supplyApyPercentage: 1.31,
    utilizationPercentage: 54,
  },
  {
    borrowApyPercentage: 2.78,
    supplyApyPercentage: 1.36,
    utilizationPercentage: 55.00000000000001,
  },
  {
    borrowApyPercentage: 2.83,
    supplyApyPercentage: 1.41,
    utilizationPercentage: 56.00000000000001,
  },
  {
    borrowApyPercentage: 2.88,
    supplyApyPercentage: 1.46,
    utilizationPercentage: 56.99999999999999,
  },
  {
    borrowApyPercentage: 2.93,
    supplyApyPercentage: 1.52,
    utilizationPercentage: 57.99999999999999,
  },
  {
    borrowApyPercentage: 2.98,
    supplyApyPercentage: 1.57,
    utilizationPercentage: 59,
  },
  {
    borrowApyPercentage: 3.03,
    supplyApyPercentage: 1.62,
    utilizationPercentage: 60,
  },
  {
    borrowApyPercentage: 3.08,
    supplyApyPercentage: 1.68,
    utilizationPercentage: 61,
  },
  {
    borrowApyPercentage: 3.13,
    supplyApyPercentage: 1.73,
    utilizationPercentage: 62,
  },
  {
    borrowApyPercentage: 3.19,
    supplyApyPercentage: 1.79,
    utilizationPercentage: 63,
  },
  {
    borrowApyPercentage: 3.24,
    supplyApyPercentage: 1.85,
    utilizationPercentage: 64,
  },
  {
    borrowApyPercentage: 3.29,
    supplyApyPercentage: 1.91,
    utilizationPercentage: 65,
  },
  {
    borrowApyPercentage: 3.34,
    supplyApyPercentage: 1.97,
    utilizationPercentage: 66,
  },
  {
    borrowApyPercentage: 3.39,
    supplyApyPercentage: 2.03,
    utilizationPercentage: 67,
  },
  {
    borrowApyPercentage: 3.44,
    supplyApyPercentage: 2.09,
    utilizationPercentage: 68,
  },
  {
    borrowApyPercentage: 3.5,
    supplyApyPercentage: 2.15,
    utilizationPercentage: 69,
  },
  {
    borrowApyPercentage: 3.55,
    supplyApyPercentage: 2.22,
    utilizationPercentage: 70,
  },
  {
    borrowApyPercentage: 3.6,
    supplyApyPercentage: 2.28,
    utilizationPercentage: 71,
  },
  {
    borrowApyPercentage: 3.65,
    supplyApyPercentage: 2.35,
    utilizationPercentage: 72,
  },
  {
    borrowApyPercentage: 3.7,
    supplyApyPercentage: 2.42,
    utilizationPercentage: 73,
  },
  {
    borrowApyPercentage: 3.75,
    supplyApyPercentage: 2.48,
    utilizationPercentage: 74,
  },
  {
    borrowApyPercentage: 3.81,
    supplyApyPercentage: 2.55,
    utilizationPercentage: 75,
  },
  {
    borrowApyPercentage: 3.86,
    supplyApyPercentage: 2.62,
    utilizationPercentage: 76,
  },
  {
    borrowApyPercentage: 3.91,
    supplyApyPercentage: 2.69,
    utilizationPercentage: 77,
  },
  {
    borrowApyPercentage: 3.96,
    supplyApyPercentage: 2.76,
    utilizationPercentage: 78,
  },
  {
    borrowApyPercentage: 4.01,
    supplyApyPercentage: 2.84,
    utilizationPercentage: 79,
  },
  {
    borrowApyPercentage: 4.06,
    supplyApyPercentage: 2.91,
    utilizationPercentage: 80,
  },
  {
    borrowApyPercentage: 5.2,
    supplyApyPercentage: 3.76,
    utilizationPercentage: 81,
  },
  {
    borrowApyPercentage: 6.35,
    supplyApyPercentage: 4.65,
    utilizationPercentage: 82,
  },
  {
    borrowApyPercentage: 7.52,
    supplyApyPercentage: 5.56,
    utilizationPercentage: 83,
  },
  {
    borrowApyPercentage: 8.69,
    supplyApyPercentage: 6.5,
    utilizationPercentage: 84,
  },
  {
    borrowApyPercentage: 9.87,
    supplyApyPercentage: 7.47,
    utilizationPercentage: 85,
  },
  {
    borrowApyPercentage: 11.08,
    supplyApyPercentage: 8.47,
    utilizationPercentage: 86,
  },
  {
    borrowApyPercentage: 12.29,
    supplyApyPercentage: 9.5,
    utilizationPercentage: 87,
  },
  {
    borrowApyPercentage: 13.51,
    supplyApyPercentage: 10.56,
    utilizationPercentage: 88,
  },
  {
    borrowApyPercentage: 14.76,
    supplyApyPercentage: 11.66,
    utilizationPercentage: 89,
  },
  {
    borrowApyPercentage: 16.01,
    supplyApyPercentage: 12.78,
    utilizationPercentage: 90,
  },
  {
    borrowApyPercentage: 17.28,
    supplyApyPercentage: 13.94,
    utilizationPercentage: 91,
  },
  {
    borrowApyPercentage: 18.56,
    supplyApyPercentage: 15.13,
    utilizationPercentage: 92,
  },
  {
    borrowApyPercentage: 19.85,
    supplyApyPercentage: 16.37,
    utilizationPercentage: 93,
  },
  {
    borrowApyPercentage: 21.17,
    supplyApyPercentage: 17.64,
    utilizationPercentage: 94,
  },
  {
    borrowApyPercentage: 22.49,
    supplyApyPercentage: 18.94,
    utilizationPercentage: 95,
  },
  {
    borrowApyPercentage: 23.82,
    supplyApyPercentage: 20.28,
    utilizationPercentage: 96,
  },
  {
    borrowApyPercentage: 25.18,
    supplyApyPercentage: 21.66,
    utilizationPercentage: 97,
  },
  {
    borrowApyPercentage: 26.55,
    supplyApyPercentage: 23.08,
    utilizationPercentage: 98,
  },
  {
    borrowApyPercentage: 27.93,
    supplyApyPercentage: 24.54,
    utilizationPercentage: 99,
  },
  {
    borrowApyPercentage: 29.33,
    supplyApyPercentage: 26.04,
    utilizationPercentage: 100,
  },
];

export default {
  title: 'Components/InterestRateChart',
  component: InterestRateChart,
  decorators: [withThemeProvider, withCenterStory({ width: 700 })],
} as ComponentMeta<typeof InterestRateChart>;

export const Default = () => <InterestRateChart data={data} />;
