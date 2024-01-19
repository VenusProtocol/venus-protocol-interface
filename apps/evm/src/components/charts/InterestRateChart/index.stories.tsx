import { Meta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { InterestRateChart, InterestRateItem } from '.';

const data: InterestRateItem[] = [
  {
    borrowApyPercentage: 0.04,
    supplyApyPercentage: 0,
    utilizationRatePercentage: 1,
  },
  {
    borrowApyPercentage: 0.09,
    supplyApyPercentage: 0,
    utilizationRatePercentage: 2,
  },
  {
    borrowApyPercentage: 0.14,
    supplyApyPercentage: 0,
    utilizationRatePercentage: 3,
  },
  {
    borrowApyPercentage: 0.19,
    supplyApyPercentage: 0,
    utilizationRatePercentage: 4,
  },
  {
    borrowApyPercentage: 0.24,
    supplyApyPercentage: 0.01,
    utilizationRatePercentage: 5,
  },
  {
    borrowApyPercentage: 0.29,
    supplyApyPercentage: 0.01,
    utilizationRatePercentage: 6,
  },
  {
    borrowApyPercentage: 0.34,
    supplyApyPercentage: 0.02,
    utilizationRatePercentage: 7.000000000000001,
  },
  {
    borrowApyPercentage: 0.39,
    supplyApyPercentage: 0.02,
    utilizationRatePercentage: 8,
  },
  {
    borrowApyPercentage: 0.44,
    supplyApyPercentage: 0.03,
    utilizationRatePercentage: 9,
  },
  {
    borrowApyPercentage: 0.49,
    supplyApyPercentage: 0.04,
    utilizationRatePercentage: 10,
  },
  {
    borrowApyPercentage: 0.54,
    supplyApyPercentage: 0.05,
    utilizationRatePercentage: 11,
  },
  {
    borrowApyPercentage: 0.6,
    supplyApyPercentage: 0.06,
    utilizationRatePercentage: 12,
  },
  {
    borrowApyPercentage: 0.65,
    supplyApyPercentage: 0.07,
    utilizationRatePercentage: 13,
  },
  {
    borrowApyPercentage: 0.7,
    supplyApyPercentage: 0.08,
    utilizationRatePercentage: 14.000000000000002,
  },
  {
    borrowApyPercentage: 0.75,
    supplyApyPercentage: 0.1,
    utilizationRatePercentage: 15,
  },
  {
    borrowApyPercentage: 0.8,
    supplyApyPercentage: 0.11,
    utilizationRatePercentage: 16,
  },
  {
    borrowApyPercentage: 0.85,
    supplyApyPercentage: 0.12,
    utilizationRatePercentage: 17,
  },
  {
    borrowApyPercentage: 0.9,
    supplyApyPercentage: 0.14,
    utilizationRatePercentage: 18,
  },
  {
    borrowApyPercentage: 0.95,
    supplyApyPercentage: 0.16,
    utilizationRatePercentage: 19,
  },
  {
    borrowApyPercentage: 1,
    supplyApyPercentage: 0.17,
    utilizationRatePercentage: 20,
  },
  {
    borrowApyPercentage: 1.05,
    supplyApyPercentage: 0.19,
    utilizationRatePercentage: 21,
  },
  {
    borrowApyPercentage: 1.1,
    supplyApyPercentage: 0.21,
    utilizationRatePercentage: 22,
  },
  {
    borrowApyPercentage: 1.15,
    supplyApyPercentage: 0.23,
    utilizationRatePercentage: 23,
  },
  {
    borrowApyPercentage: 1.2,
    supplyApyPercentage: 0.25,
    utilizationRatePercentage: 24,
  },
  {
    borrowApyPercentage: 1.25,
    supplyApyPercentage: 0.28,
    utilizationRatePercentage: 25,
  },
  {
    borrowApyPercentage: 1.3,
    supplyApyPercentage: 0.3,
    utilizationRatePercentage: 26,
  },
  {
    borrowApyPercentage: 1.35,
    supplyApyPercentage: 0.32,
    utilizationRatePercentage: 27,
  },
  {
    borrowApyPercentage: 1.4,
    supplyApyPercentage: 0.35,
    utilizationRatePercentage: 28.000000000000004,
  },
  {
    borrowApyPercentage: 1.45,
    supplyApyPercentage: 0.37,
    utilizationRatePercentage: 28.999999999999996,
  },
  {
    borrowApyPercentage: 1.5,
    supplyApyPercentage: 0.4,
    utilizationRatePercentage: 30,
  },
  {
    borrowApyPercentage: 1.55,
    supplyApyPercentage: 0.43,
    utilizationRatePercentage: 31,
  },
  {
    borrowApyPercentage: 1.6,
    supplyApyPercentage: 0.46,
    utilizationRatePercentage: 32,
  },
  {
    borrowApyPercentage: 1.65,
    supplyApyPercentage: 0.48,
    utilizationRatePercentage: 33,
  },
  {
    borrowApyPercentage: 1.7,
    supplyApyPercentage: 0.52,
    utilizationRatePercentage: 34,
  },
  {
    borrowApyPercentage: 1.76,
    supplyApyPercentage: 0.55,
    utilizationRatePercentage: 35,
  },
  {
    borrowApyPercentage: 1.81,
    supplyApyPercentage: 0.58,
    utilizationRatePercentage: 36,
  },
  {
    borrowApyPercentage: 1.86,
    supplyApyPercentage: 0.61,
    utilizationRatePercentage: 37,
  },
  {
    borrowApyPercentage: 1.91,
    supplyApyPercentage: 0.65,
    utilizationRatePercentage: 38,
  },
  {
    borrowApyPercentage: 1.96,
    supplyApyPercentage: 0.68,
    utilizationRatePercentage: 39,
  },
  {
    borrowApyPercentage: 2.01,
    supplyApyPercentage: 0.72,
    utilizationRatePercentage: 40,
  },
  {
    borrowApyPercentage: 2.06,
    supplyApyPercentage: 0.75,
    utilizationRatePercentage: 41,
  },
  {
    borrowApyPercentage: 2.11,
    supplyApyPercentage: 0.79,
    utilizationRatePercentage: 42,
  },
  {
    borrowApyPercentage: 2.16,
    supplyApyPercentage: 0.83,
    utilizationRatePercentage: 43,
  },
  {
    borrowApyPercentage: 2.21,
    supplyApyPercentage: 0.87,
    utilizationRatePercentage: 44,
  },
  {
    borrowApyPercentage: 2.26,
    supplyApyPercentage: 0.91,
    utilizationRatePercentage: 45,
  },
  {
    borrowApyPercentage: 2.32,
    supplyApyPercentage: 0.95,
    utilizationRatePercentage: 46,
  },
  {
    borrowApyPercentage: 2.37,
    supplyApyPercentage: 0.99,
    utilizationRatePercentage: 47,
  },
  {
    borrowApyPercentage: 2.42,
    supplyApyPercentage: 1.03,
    utilizationRatePercentage: 48,
  },
  {
    borrowApyPercentage: 2.47,
    supplyApyPercentage: 1.08,
    utilizationRatePercentage: 49,
  },
  {
    borrowApyPercentage: 2.52,
    supplyApyPercentage: 1.12,
    utilizationRatePercentage: 50,
  },
  {
    borrowApyPercentage: 2.57,
    supplyApyPercentage: 1.17,
    utilizationRatePercentage: 51,
  },
  {
    borrowApyPercentage: 2.62,
    supplyApyPercentage: 1.22,
    utilizationRatePercentage: 52,
  },
  {
    borrowApyPercentage: 2.67,
    supplyApyPercentage: 1.26,
    utilizationRatePercentage: 53,
  },
  {
    borrowApyPercentage: 2.72,
    supplyApyPercentage: 1.31,
    utilizationRatePercentage: 54,
  },
  {
    borrowApyPercentage: 2.78,
    supplyApyPercentage: 1.36,
    utilizationRatePercentage: 55.00000000000001,
  },
  {
    borrowApyPercentage: 2.83,
    supplyApyPercentage: 1.41,
    utilizationRatePercentage: 56.00000000000001,
  },
  {
    borrowApyPercentage: 2.88,
    supplyApyPercentage: 1.46,
    utilizationRatePercentage: 56.99999999999999,
  },
  {
    borrowApyPercentage: 2.93,
    supplyApyPercentage: 1.52,
    utilizationRatePercentage: 57.99999999999999,
  },
  {
    borrowApyPercentage: 2.98,
    supplyApyPercentage: 1.57,
    utilizationRatePercentage: 59,
  },
  {
    borrowApyPercentage: 3.03,
    supplyApyPercentage: 1.62,
    utilizationRatePercentage: 60,
  },
  {
    borrowApyPercentage: 3.08,
    supplyApyPercentage: 1.68,
    utilizationRatePercentage: 61,
  },
  {
    borrowApyPercentage: 3.13,
    supplyApyPercentage: 1.73,
    utilizationRatePercentage: 62,
  },
  {
    borrowApyPercentage: 3.19,
    supplyApyPercentage: 1.79,
    utilizationRatePercentage: 63,
  },
  {
    borrowApyPercentage: 3.24,
    supplyApyPercentage: 1.85,
    utilizationRatePercentage: 64,
  },
  {
    borrowApyPercentage: 3.29,
    supplyApyPercentage: 1.91,
    utilizationRatePercentage: 65,
  },
  {
    borrowApyPercentage: 3.34,
    supplyApyPercentage: 1.97,
    utilizationRatePercentage: 66,
  },
  {
    borrowApyPercentage: 3.39,
    supplyApyPercentage: 2.03,
    utilizationRatePercentage: 67,
  },
  {
    borrowApyPercentage: 3.44,
    supplyApyPercentage: 2.09,
    utilizationRatePercentage: 68,
  },
  {
    borrowApyPercentage: 3.5,
    supplyApyPercentage: 2.15,
    utilizationRatePercentage: 69,
  },
  {
    borrowApyPercentage: 3.55,
    supplyApyPercentage: 2.22,
    utilizationRatePercentage: 70,
  },
  {
    borrowApyPercentage: 3.6,
    supplyApyPercentage: 2.28,
    utilizationRatePercentage: 71,
  },
  {
    borrowApyPercentage: 3.65,
    supplyApyPercentage: 2.35,
    utilizationRatePercentage: 72,
  },
  {
    borrowApyPercentage: 3.7,
    supplyApyPercentage: 2.42,
    utilizationRatePercentage: 73,
  },
  {
    borrowApyPercentage: 3.75,
    supplyApyPercentage: 2.48,
    utilizationRatePercentage: 74,
  },
  {
    borrowApyPercentage: 3.81,
    supplyApyPercentage: 2.55,
    utilizationRatePercentage: 75,
  },
  {
    borrowApyPercentage: 3.86,
    supplyApyPercentage: 2.62,
    utilizationRatePercentage: 76,
  },
  {
    borrowApyPercentage: 3.91,
    supplyApyPercentage: 2.69,
    utilizationRatePercentage: 77,
  },
  {
    borrowApyPercentage: 3.96,
    supplyApyPercentage: 2.76,
    utilizationRatePercentage: 78,
  },
  {
    borrowApyPercentage: 4.01,
    supplyApyPercentage: 2.84,
    utilizationRatePercentage: 79,
  },
  {
    borrowApyPercentage: 4.06,
    supplyApyPercentage: 2.91,
    utilizationRatePercentage: 80,
  },
  {
    borrowApyPercentage: 5.2,
    supplyApyPercentage: 3.76,
    utilizationRatePercentage: 81,
  },
  {
    borrowApyPercentage: 6.35,
    supplyApyPercentage: 4.65,
    utilizationRatePercentage: 82,
  },
  {
    borrowApyPercentage: 7.52,
    supplyApyPercentage: 5.56,
    utilizationRatePercentage: 83,
  },
  {
    borrowApyPercentage: 8.69,
    supplyApyPercentage: 6.5,
    utilizationRatePercentage: 84,
  },
  {
    borrowApyPercentage: 9.87,
    supplyApyPercentage: 7.47,
    utilizationRatePercentage: 85,
  },
  {
    borrowApyPercentage: 11.08,
    supplyApyPercentage: 8.47,
    utilizationRatePercentage: 86,
  },
  {
    borrowApyPercentage: 12.29,
    supplyApyPercentage: 9.5,
    utilizationRatePercentage: 87,
  },
  {
    borrowApyPercentage: 13.51,
    supplyApyPercentage: 10.56,
    utilizationRatePercentage: 88,
  },
  {
    borrowApyPercentage: 14.76,
    supplyApyPercentage: 11.66,
    utilizationRatePercentage: 89,
  },
  {
    borrowApyPercentage: 16.01,
    supplyApyPercentage: 12.78,
    utilizationRatePercentage: 90,
  },
  {
    borrowApyPercentage: 17.28,
    supplyApyPercentage: 13.94,
    utilizationRatePercentage: 91,
  },
  {
    borrowApyPercentage: 18.56,
    supplyApyPercentage: 15.13,
    utilizationRatePercentage: 92,
  },
  {
    borrowApyPercentage: 19.85,
    supplyApyPercentage: 16.37,
    utilizationRatePercentage: 93,
  },
  {
    borrowApyPercentage: 21.17,
    supplyApyPercentage: 17.64,
    utilizationRatePercentage: 94,
  },
  {
    borrowApyPercentage: 22.49,
    supplyApyPercentage: 18.94,
    utilizationRatePercentage: 95,
  },
  {
    borrowApyPercentage: 23.82,
    supplyApyPercentage: 20.28,
    utilizationRatePercentage: 96,
  },
  {
    borrowApyPercentage: 25.18,
    supplyApyPercentage: 21.66,
    utilizationRatePercentage: 97,
  },
  {
    borrowApyPercentage: 26.55,
    supplyApyPercentage: 23.08,
    utilizationRatePercentage: 98,
  },
  {
    borrowApyPercentage: 27.93,
    supplyApyPercentage: 24.54,
    utilizationRatePercentage: 99,
  },
  {
    borrowApyPercentage: 29.33,
    supplyApyPercentage: 26.04,
    utilizationRatePercentage: 100,
  },
];

export default {
  title: 'Components/charts/InterestRateChart',
  component: InterestRateChart,
  decorators: [withThemeProvider, withCenterStory({ width: 700 })],
} as Meta<typeof InterestRateChart>;

export const Default = () => (
  <InterestRateChart currentUtilizationRatePercentage={56} data={data} />
);
