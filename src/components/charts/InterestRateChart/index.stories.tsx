import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { InterestRateChart, InterestRateItem } from '.';

const data: InterestRateItem[] = [
  {
    borrowApyPercentage: 0.04,
    supplyApyPercentage: 0,
    utilizationRate: 1,
  },
  {
    borrowApyPercentage: 0.09,
    supplyApyPercentage: 0,
    utilizationRate: 2,
  },
  {
    borrowApyPercentage: 0.14,
    supplyApyPercentage: 0,
    utilizationRate: 3,
  },
  {
    borrowApyPercentage: 0.19,
    supplyApyPercentage: 0,
    utilizationRate: 4,
  },
  {
    borrowApyPercentage: 0.24,
    supplyApyPercentage: 0.01,
    utilizationRate: 5,
  },
  {
    borrowApyPercentage: 0.29,
    supplyApyPercentage: 0.01,
    utilizationRate: 6,
  },
  {
    borrowApyPercentage: 0.34,
    supplyApyPercentage: 0.02,
    utilizationRate: 7.000000000000001,
  },
  {
    borrowApyPercentage: 0.39,
    supplyApyPercentage: 0.02,
    utilizationRate: 8,
  },
  {
    borrowApyPercentage: 0.44,
    supplyApyPercentage: 0.03,
    utilizationRate: 9,
  },
  {
    borrowApyPercentage: 0.49,
    supplyApyPercentage: 0.04,
    utilizationRate: 10,
  },
  {
    borrowApyPercentage: 0.54,
    supplyApyPercentage: 0.05,
    utilizationRate: 11,
  },
  {
    borrowApyPercentage: 0.6,
    supplyApyPercentage: 0.06,
    utilizationRate: 12,
  },
  {
    borrowApyPercentage: 0.65,
    supplyApyPercentage: 0.07,
    utilizationRate: 13,
  },
  {
    borrowApyPercentage: 0.7,
    supplyApyPercentage: 0.08,
    utilizationRate: 14.000000000000002,
  },
  {
    borrowApyPercentage: 0.75,
    supplyApyPercentage: 0.1,
    utilizationRate: 15,
  },
  {
    borrowApyPercentage: 0.8,
    supplyApyPercentage: 0.11,
    utilizationRate: 16,
  },
  {
    borrowApyPercentage: 0.85,
    supplyApyPercentage: 0.12,
    utilizationRate: 17,
  },
  {
    borrowApyPercentage: 0.9,
    supplyApyPercentage: 0.14,
    utilizationRate: 18,
  },
  {
    borrowApyPercentage: 0.95,
    supplyApyPercentage: 0.16,
    utilizationRate: 19,
  },
  {
    borrowApyPercentage: 1,
    supplyApyPercentage: 0.17,
    utilizationRate: 20,
  },
  {
    borrowApyPercentage: 1.05,
    supplyApyPercentage: 0.19,
    utilizationRate: 21,
  },
  {
    borrowApyPercentage: 1.1,
    supplyApyPercentage: 0.21,
    utilizationRate: 22,
  },
  {
    borrowApyPercentage: 1.15,
    supplyApyPercentage: 0.23,
    utilizationRate: 23,
  },
  {
    borrowApyPercentage: 1.2,
    supplyApyPercentage: 0.25,
    utilizationRate: 24,
  },
  {
    borrowApyPercentage: 1.25,
    supplyApyPercentage: 0.28,
    utilizationRate: 25,
  },
  {
    borrowApyPercentage: 1.3,
    supplyApyPercentage: 0.3,
    utilizationRate: 26,
  },
  {
    borrowApyPercentage: 1.35,
    supplyApyPercentage: 0.32,
    utilizationRate: 27,
  },
  {
    borrowApyPercentage: 1.4,
    supplyApyPercentage: 0.35,
    utilizationRate: 28.000000000000004,
  },
  {
    borrowApyPercentage: 1.45,
    supplyApyPercentage: 0.37,
    utilizationRate: 28.999999999999996,
  },
  {
    borrowApyPercentage: 1.5,
    supplyApyPercentage: 0.4,
    utilizationRate: 30,
  },
  {
    borrowApyPercentage: 1.55,
    supplyApyPercentage: 0.43,
    utilizationRate: 31,
  },
  {
    borrowApyPercentage: 1.6,
    supplyApyPercentage: 0.46,
    utilizationRate: 32,
  },
  {
    borrowApyPercentage: 1.65,
    supplyApyPercentage: 0.48,
    utilizationRate: 33,
  },
  {
    borrowApyPercentage: 1.7,
    supplyApyPercentage: 0.52,
    utilizationRate: 34,
  },
  {
    borrowApyPercentage: 1.76,
    supplyApyPercentage: 0.55,
    utilizationRate: 35,
  },
  {
    borrowApyPercentage: 1.81,
    supplyApyPercentage: 0.58,
    utilizationRate: 36,
  },
  {
    borrowApyPercentage: 1.86,
    supplyApyPercentage: 0.61,
    utilizationRate: 37,
  },
  {
    borrowApyPercentage: 1.91,
    supplyApyPercentage: 0.65,
    utilizationRate: 38,
  },
  {
    borrowApyPercentage: 1.96,
    supplyApyPercentage: 0.68,
    utilizationRate: 39,
  },
  {
    borrowApyPercentage: 2.01,
    supplyApyPercentage: 0.72,
    utilizationRate: 40,
  },
  {
    borrowApyPercentage: 2.06,
    supplyApyPercentage: 0.75,
    utilizationRate: 41,
  },
  {
    borrowApyPercentage: 2.11,
    supplyApyPercentage: 0.79,
    utilizationRate: 42,
  },
  {
    borrowApyPercentage: 2.16,
    supplyApyPercentage: 0.83,
    utilizationRate: 43,
  },
  {
    borrowApyPercentage: 2.21,
    supplyApyPercentage: 0.87,
    utilizationRate: 44,
  },
  {
    borrowApyPercentage: 2.26,
    supplyApyPercentage: 0.91,
    utilizationRate: 45,
  },
  {
    borrowApyPercentage: 2.32,
    supplyApyPercentage: 0.95,
    utilizationRate: 46,
  },
  {
    borrowApyPercentage: 2.37,
    supplyApyPercentage: 0.99,
    utilizationRate: 47,
  },
  {
    borrowApyPercentage: 2.42,
    supplyApyPercentage: 1.03,
    utilizationRate: 48,
  },
  {
    borrowApyPercentage: 2.47,
    supplyApyPercentage: 1.08,
    utilizationRate: 49,
  },
  {
    borrowApyPercentage: 2.52,
    supplyApyPercentage: 1.12,
    utilizationRate: 50,
  },
  {
    borrowApyPercentage: 2.57,
    supplyApyPercentage: 1.17,
    utilizationRate: 51,
  },
  {
    borrowApyPercentage: 2.62,
    supplyApyPercentage: 1.22,
    utilizationRate: 52,
  },
  {
    borrowApyPercentage: 2.67,
    supplyApyPercentage: 1.26,
    utilizationRate: 53,
  },
  {
    borrowApyPercentage: 2.72,
    supplyApyPercentage: 1.31,
    utilizationRate: 54,
  },
  {
    borrowApyPercentage: 2.78,
    supplyApyPercentage: 1.36,
    utilizationRate: 55.00000000000001,
  },
  {
    borrowApyPercentage: 2.83,
    supplyApyPercentage: 1.41,
    utilizationRate: 56.00000000000001,
  },
  {
    borrowApyPercentage: 2.88,
    supplyApyPercentage: 1.46,
    utilizationRate: 56.99999999999999,
  },
  {
    borrowApyPercentage: 2.93,
    supplyApyPercentage: 1.52,
    utilizationRate: 57.99999999999999,
  },
  {
    borrowApyPercentage: 2.98,
    supplyApyPercentage: 1.57,
    utilizationRate: 59,
  },
  {
    borrowApyPercentage: 3.03,
    supplyApyPercentage: 1.62,
    utilizationRate: 60,
  },
  {
    borrowApyPercentage: 3.08,
    supplyApyPercentage: 1.68,
    utilizationRate: 61,
  },
  {
    borrowApyPercentage: 3.13,
    supplyApyPercentage: 1.73,
    utilizationRate: 62,
  },
  {
    borrowApyPercentage: 3.19,
    supplyApyPercentage: 1.79,
    utilizationRate: 63,
  },
  {
    borrowApyPercentage: 3.24,
    supplyApyPercentage: 1.85,
    utilizationRate: 64,
  },
  {
    borrowApyPercentage: 3.29,
    supplyApyPercentage: 1.91,
    utilizationRate: 65,
  },
  {
    borrowApyPercentage: 3.34,
    supplyApyPercentage: 1.97,
    utilizationRate: 66,
  },
  {
    borrowApyPercentage: 3.39,
    supplyApyPercentage: 2.03,
    utilizationRate: 67,
  },
  {
    borrowApyPercentage: 3.44,
    supplyApyPercentage: 2.09,
    utilizationRate: 68,
  },
  {
    borrowApyPercentage: 3.5,
    supplyApyPercentage: 2.15,
    utilizationRate: 69,
  },
  {
    borrowApyPercentage: 3.55,
    supplyApyPercentage: 2.22,
    utilizationRate: 70,
  },
  {
    borrowApyPercentage: 3.6,
    supplyApyPercentage: 2.28,
    utilizationRate: 71,
  },
  {
    borrowApyPercentage: 3.65,
    supplyApyPercentage: 2.35,
    utilizationRate: 72,
  },
  {
    borrowApyPercentage: 3.7,
    supplyApyPercentage: 2.42,
    utilizationRate: 73,
  },
  {
    borrowApyPercentage: 3.75,
    supplyApyPercentage: 2.48,
    utilizationRate: 74,
  },
  {
    borrowApyPercentage: 3.81,
    supplyApyPercentage: 2.55,
    utilizationRate: 75,
  },
  {
    borrowApyPercentage: 3.86,
    supplyApyPercentage: 2.62,
    utilizationRate: 76,
  },
  {
    borrowApyPercentage: 3.91,
    supplyApyPercentage: 2.69,
    utilizationRate: 77,
  },
  {
    borrowApyPercentage: 3.96,
    supplyApyPercentage: 2.76,
    utilizationRate: 78,
  },
  {
    borrowApyPercentage: 4.01,
    supplyApyPercentage: 2.84,
    utilizationRate: 79,
  },
  {
    borrowApyPercentage: 4.06,
    supplyApyPercentage: 2.91,
    utilizationRate: 80,
  },
  {
    borrowApyPercentage: 5.2,
    supplyApyPercentage: 3.76,
    utilizationRate: 81,
  },
  {
    borrowApyPercentage: 6.35,
    supplyApyPercentage: 4.65,
    utilizationRate: 82,
  },
  {
    borrowApyPercentage: 7.52,
    supplyApyPercentage: 5.56,
    utilizationRate: 83,
  },
  {
    borrowApyPercentage: 8.69,
    supplyApyPercentage: 6.5,
    utilizationRate: 84,
  },
  {
    borrowApyPercentage: 9.87,
    supplyApyPercentage: 7.47,
    utilizationRate: 85,
  },
  {
    borrowApyPercentage: 11.08,
    supplyApyPercentage: 8.47,
    utilizationRate: 86,
  },
  {
    borrowApyPercentage: 12.29,
    supplyApyPercentage: 9.5,
    utilizationRate: 87,
  },
  {
    borrowApyPercentage: 13.51,
    supplyApyPercentage: 10.56,
    utilizationRate: 88,
  },
  {
    borrowApyPercentage: 14.76,
    supplyApyPercentage: 11.66,
    utilizationRate: 89,
  },
  {
    borrowApyPercentage: 16.01,
    supplyApyPercentage: 12.78,
    utilizationRate: 90,
  },
  {
    borrowApyPercentage: 17.28,
    supplyApyPercentage: 13.94,
    utilizationRate: 91,
  },
  {
    borrowApyPercentage: 18.56,
    supplyApyPercentage: 15.13,
    utilizationRate: 92,
  },
  {
    borrowApyPercentage: 19.85,
    supplyApyPercentage: 16.37,
    utilizationRate: 93,
  },
  {
    borrowApyPercentage: 21.17,
    supplyApyPercentage: 17.64,
    utilizationRate: 94,
  },
  {
    borrowApyPercentage: 22.49,
    supplyApyPercentage: 18.94,
    utilizationRate: 95,
  },
  {
    borrowApyPercentage: 23.82,
    supplyApyPercentage: 20.28,
    utilizationRate: 96,
  },
  {
    borrowApyPercentage: 25.18,
    supplyApyPercentage: 21.66,
    utilizationRate: 97,
  },
  {
    borrowApyPercentage: 26.55,
    supplyApyPercentage: 23.08,
    utilizationRate: 98,
  },
  {
    borrowApyPercentage: 27.93,
    supplyApyPercentage: 24.54,
    utilizationRate: 99,
  },
  {
    borrowApyPercentage: 29.33,
    supplyApyPercentage: 26.04,
    utilizationRate: 100,
  },
];

export default {
  title: 'Components/charts/InterestRateChart',
  component: InterestRateChart,
  decorators: [withThemeProvider, withCenterStory({ width: 700 })],
} as Meta<typeof InterestRateChart>;

export const Default = () => <InterestRateChart currentUtilizationRate={56} data={data} />;
