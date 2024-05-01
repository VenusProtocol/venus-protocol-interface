import type { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { InterestRateChart, type InterestRateItem } from '.';

const data: InterestRateItem[] = [
  {
    borrowApyPercentage: new BigNumber(0.04),
    supplyApyPercentage: new BigNumber(0),
    utilizationRatePercentage: 1,
  },
  {
    borrowApyPercentage: new BigNumber(0.09),
    supplyApyPercentage: new BigNumber(0),
    utilizationRatePercentage: 2,
  },
  {
    borrowApyPercentage: new BigNumber(0.14),
    supplyApyPercentage: new BigNumber(0),
    utilizationRatePercentage: 3,
  },
  {
    borrowApyPercentage: new BigNumber(0.19),
    supplyApyPercentage: new BigNumber(0),
    utilizationRatePercentage: 4,
  },
  {
    borrowApyPercentage: new BigNumber(0.24),
    supplyApyPercentage: new BigNumber(0.01),
    utilizationRatePercentage: 5,
  },
  {
    borrowApyPercentage: new BigNumber(0.29),
    supplyApyPercentage: new BigNumber(0.01),
    utilizationRatePercentage: 6,
  },
  {
    borrowApyPercentage: new BigNumber(0.34),
    supplyApyPercentage: new BigNumber(0.02),
    utilizationRatePercentage: 7.000000000000001,
  },
  {
    borrowApyPercentage: new BigNumber(0.39),
    supplyApyPercentage: new BigNumber(0.02),
    utilizationRatePercentage: 8,
  },
  {
    borrowApyPercentage: new BigNumber(0.44),
    supplyApyPercentage: new BigNumber(0.03),
    utilizationRatePercentage: 9,
  },
  {
    borrowApyPercentage: new BigNumber(0.49),
    supplyApyPercentage: new BigNumber(0.04),
    utilizationRatePercentage: 10,
  },
  {
    borrowApyPercentage: new BigNumber(0.54),
    supplyApyPercentage: new BigNumber(0.05),
    utilizationRatePercentage: 11,
  },
  {
    borrowApyPercentage: new BigNumber(0.6),
    supplyApyPercentage: new BigNumber(0.06),
    utilizationRatePercentage: 12,
  },
  {
    borrowApyPercentage: new BigNumber(0.65),
    supplyApyPercentage: new BigNumber(0.07),
    utilizationRatePercentage: 13,
  },
  {
    borrowApyPercentage: new BigNumber(0.7),
    supplyApyPercentage: new BigNumber(0.08),
    utilizationRatePercentage: 14.000000000000002,
  },
  {
    borrowApyPercentage: new BigNumber(0.75),
    supplyApyPercentage: new BigNumber(0.1),
    utilizationRatePercentage: 15,
  },
  {
    borrowApyPercentage: new BigNumber(0.8),
    supplyApyPercentage: new BigNumber(0.11),
    utilizationRatePercentage: 16,
  },
  {
    borrowApyPercentage: new BigNumber(0.85),
    supplyApyPercentage: new BigNumber(0.12),
    utilizationRatePercentage: 17,
  },
  {
    borrowApyPercentage: new BigNumber(0.9),
    supplyApyPercentage: new BigNumber(0.14),
    utilizationRatePercentage: 18,
  },
  {
    borrowApyPercentage: new BigNumber(0.95),
    supplyApyPercentage: new BigNumber(0.16),
    utilizationRatePercentage: 19,
  },
  {
    borrowApyPercentage: new BigNumber(1),
    supplyApyPercentage: new BigNumber(0.17),
    utilizationRatePercentage: 20,
  },
  {
    borrowApyPercentage: new BigNumber(1.05),
    supplyApyPercentage: new BigNumber(0.19),
    utilizationRatePercentage: 21,
  },
  {
    borrowApyPercentage: new BigNumber(1.1),
    supplyApyPercentage: new BigNumber(0.21),
    utilizationRatePercentage: 22,
  },
  {
    borrowApyPercentage: new BigNumber(1.15),
    supplyApyPercentage: new BigNumber(0.23),
    utilizationRatePercentage: 23,
  },
  {
    borrowApyPercentage: new BigNumber(1.2),
    supplyApyPercentage: new BigNumber(0.25),
    utilizationRatePercentage: 24,
  },
  {
    borrowApyPercentage: new BigNumber(1.25),
    supplyApyPercentage: new BigNumber(0.28),
    utilizationRatePercentage: 25,
  },
  {
    borrowApyPercentage: new BigNumber(1.3),
    supplyApyPercentage: new BigNumber(0.3),
    utilizationRatePercentage: 26,
  },
  {
    borrowApyPercentage: new BigNumber(1.35),
    supplyApyPercentage: new BigNumber(0.32),
    utilizationRatePercentage: 27,
  },
  {
    borrowApyPercentage: new BigNumber(1.4),
    supplyApyPercentage: new BigNumber(0.35),
    utilizationRatePercentage: 28.000000000000004,
  },
  {
    borrowApyPercentage: new BigNumber(1.45),
    supplyApyPercentage: new BigNumber(0.37),
    utilizationRatePercentage: 28.999999999999996,
  },
  {
    borrowApyPercentage: new BigNumber(1.5),
    supplyApyPercentage: new BigNumber(0.4),
    utilizationRatePercentage: 30,
  },
  {
    borrowApyPercentage: new BigNumber(1.55),
    supplyApyPercentage: new BigNumber(0.43),
    utilizationRatePercentage: 31,
  },
  {
    borrowApyPercentage: new BigNumber(1.6),
    supplyApyPercentage: new BigNumber(0.46),
    utilizationRatePercentage: 32,
  },
  {
    borrowApyPercentage: new BigNumber(1.65),
    supplyApyPercentage: new BigNumber(0.48),
    utilizationRatePercentage: 33,
  },
  {
    borrowApyPercentage: new BigNumber(1.7),
    supplyApyPercentage: new BigNumber(0.52),
    utilizationRatePercentage: 34,
  },
  {
    borrowApyPercentage: new BigNumber(1.76),
    supplyApyPercentage: new BigNumber(0.55),
    utilizationRatePercentage: 35,
  },
  {
    borrowApyPercentage: new BigNumber(1.81),
    supplyApyPercentage: new BigNumber(0.58),
    utilizationRatePercentage: 36,
  },
  {
    borrowApyPercentage: new BigNumber(1.86),
    supplyApyPercentage: new BigNumber(0.61),
    utilizationRatePercentage: 37,
  },
  {
    borrowApyPercentage: new BigNumber(1.91),
    supplyApyPercentage: new BigNumber(0.65),
    utilizationRatePercentage: 38,
  },
  {
    borrowApyPercentage: new BigNumber(1.96),
    supplyApyPercentage: new BigNumber(0.68),
    utilizationRatePercentage: 39,
  },
  {
    borrowApyPercentage: new BigNumber(2.01),
    supplyApyPercentage: new BigNumber(0.72),
    utilizationRatePercentage: 40,
  },
  {
    borrowApyPercentage: new BigNumber(2.06),
    supplyApyPercentage: new BigNumber(0.75),
    utilizationRatePercentage: 41,
  },
  {
    borrowApyPercentage: new BigNumber(2.11),
    supplyApyPercentage: new BigNumber(0.79),
    utilizationRatePercentage: 42,
  },
  {
    borrowApyPercentage: new BigNumber(2.16),
    supplyApyPercentage: new BigNumber(0.83),
    utilizationRatePercentage: 43,
  },
  {
    borrowApyPercentage: new BigNumber(2.21),
    supplyApyPercentage: new BigNumber(0.87),
    utilizationRatePercentage: 44,
  },
  {
    borrowApyPercentage: new BigNumber(2.26),
    supplyApyPercentage: new BigNumber(0.91),
    utilizationRatePercentage: 45,
  },
  {
    borrowApyPercentage: new BigNumber(2.32),
    supplyApyPercentage: new BigNumber(0.95),
    utilizationRatePercentage: 46,
  },
  {
    borrowApyPercentage: new BigNumber(2.37),
    supplyApyPercentage: new BigNumber(0.99),
    utilizationRatePercentage: 47,
  },
  {
    borrowApyPercentage: new BigNumber(2.42),
    supplyApyPercentage: new BigNumber(1.03),
    utilizationRatePercentage: 48,
  },
  {
    borrowApyPercentage: new BigNumber(2.47),
    supplyApyPercentage: new BigNumber(1.08),
    utilizationRatePercentage: 49,
  },
  {
    borrowApyPercentage: new BigNumber(2.52),
    supplyApyPercentage: new BigNumber(1.12),
    utilizationRatePercentage: 50,
  },
  {
    borrowApyPercentage: new BigNumber(2.57),
    supplyApyPercentage: new BigNumber(1.17),
    utilizationRatePercentage: 51,
  },
  {
    borrowApyPercentage: new BigNumber(2.62),
    supplyApyPercentage: new BigNumber(1.22),
    utilizationRatePercentage: 52,
  },
  {
    borrowApyPercentage: new BigNumber(2.67),
    supplyApyPercentage: new BigNumber(1.26),
    utilizationRatePercentage: 53,
  },
  {
    borrowApyPercentage: new BigNumber(2.72),
    supplyApyPercentage: new BigNumber(1.31),
    utilizationRatePercentage: 54,
  },
  {
    borrowApyPercentage: new BigNumber(2.78),
    supplyApyPercentage: new BigNumber(1.36),
    utilizationRatePercentage: 55.00000000000001,
  },
  {
    borrowApyPercentage: new BigNumber(2.83),
    supplyApyPercentage: new BigNumber(1.41),
    utilizationRatePercentage: 56.00000000000001,
  },
  {
    borrowApyPercentage: new BigNumber(2.88),
    supplyApyPercentage: new BigNumber(1.46),
    utilizationRatePercentage: 56.99999999999999,
  },
  {
    borrowApyPercentage: new BigNumber(2.93),
    supplyApyPercentage: new BigNumber(1.52),
    utilizationRatePercentage: 57.99999999999999,
  },
  {
    borrowApyPercentage: new BigNumber(2.98),
    supplyApyPercentage: new BigNumber(1.57),
    utilizationRatePercentage: 59,
  },
  {
    borrowApyPercentage: new BigNumber(3.03),
    supplyApyPercentage: new BigNumber(1.62),
    utilizationRatePercentage: 60,
  },
  {
    borrowApyPercentage: new BigNumber(3.08),
    supplyApyPercentage: new BigNumber(1.68),
    utilizationRatePercentage: 61,
  },
  {
    borrowApyPercentage: new BigNumber(3.13),
    supplyApyPercentage: new BigNumber(1.73),
    utilizationRatePercentage: 62,
  },
  {
    borrowApyPercentage: new BigNumber(3.19),
    supplyApyPercentage: new BigNumber(1.79),
    utilizationRatePercentage: 63,
  },
  {
    borrowApyPercentage: new BigNumber(3.24),
    supplyApyPercentage: new BigNumber(1.85),
    utilizationRatePercentage: 64,
  },
  {
    borrowApyPercentage: new BigNumber(3.29),
    supplyApyPercentage: new BigNumber(1.91),
    utilizationRatePercentage: 65,
  },
  {
    borrowApyPercentage: new BigNumber(3.34),
    supplyApyPercentage: new BigNumber(1.97),
    utilizationRatePercentage: 66,
  },
  {
    borrowApyPercentage: new BigNumber(3.39),
    supplyApyPercentage: new BigNumber(2.03),
    utilizationRatePercentage: 67,
  },
  {
    borrowApyPercentage: new BigNumber(3.44),
    supplyApyPercentage: new BigNumber(2.09),
    utilizationRatePercentage: 68,
  },
  {
    borrowApyPercentage: new BigNumber(3.5),
    supplyApyPercentage: new BigNumber(2.15),
    utilizationRatePercentage: 69,
  },
  {
    borrowApyPercentage: new BigNumber(3.55),
    supplyApyPercentage: new BigNumber(2.22),
    utilizationRatePercentage: 70,
  },
  {
    borrowApyPercentage: new BigNumber(3.6),
    supplyApyPercentage: new BigNumber(2.28),
    utilizationRatePercentage: 71,
  },
  {
    borrowApyPercentage: new BigNumber(3.65),
    supplyApyPercentage: new BigNumber(2.35),
    utilizationRatePercentage: 72,
  },
  {
    borrowApyPercentage: new BigNumber(3.7),
    supplyApyPercentage: new BigNumber(2.42),
    utilizationRatePercentage: 73,
  },
  {
    borrowApyPercentage: new BigNumber(3.75),
    supplyApyPercentage: new BigNumber(2.48),
    utilizationRatePercentage: 74,
  },
  {
    borrowApyPercentage: new BigNumber(3.81),
    supplyApyPercentage: new BigNumber(2.55),
    utilizationRatePercentage: 75,
  },
  {
    borrowApyPercentage: new BigNumber(3.86),
    supplyApyPercentage: new BigNumber(2.62),
    utilizationRatePercentage: 76,
  },
  {
    borrowApyPercentage: new BigNumber(3.91),
    supplyApyPercentage: new BigNumber(2.69),
    utilizationRatePercentage: 77,
  },
  {
    borrowApyPercentage: new BigNumber(3.96),
    supplyApyPercentage: new BigNumber(2.76),
    utilizationRatePercentage: 78,
  },
  {
    borrowApyPercentage: new BigNumber(4.01),
    supplyApyPercentage: new BigNumber(2.84),
    utilizationRatePercentage: 79,
  },
  {
    borrowApyPercentage: new BigNumber(4.06),
    supplyApyPercentage: new BigNumber(2.91),
    utilizationRatePercentage: 80,
  },
  {
    borrowApyPercentage: new BigNumber(5.2),
    supplyApyPercentage: new BigNumber(3.76),
    utilizationRatePercentage: 81,
  },
  {
    borrowApyPercentage: new BigNumber(6.35),
    supplyApyPercentage: new BigNumber(4.65),
    utilizationRatePercentage: 82,
  },
  {
    borrowApyPercentage: new BigNumber(7.52),
    supplyApyPercentage: new BigNumber(5.56),
    utilizationRatePercentage: 83,
  },
  {
    borrowApyPercentage: new BigNumber(8.69),
    supplyApyPercentage: new BigNumber(6.5),
    utilizationRatePercentage: 84,
  },
  {
    borrowApyPercentage: new BigNumber(9.87),
    supplyApyPercentage: new BigNumber(7.47),
    utilizationRatePercentage: 85,
  },
  {
    borrowApyPercentage: new BigNumber(11.08),
    supplyApyPercentage: new BigNumber(8.47),
    utilizationRatePercentage: 86,
  },
  {
    borrowApyPercentage: new BigNumber(12.29),
    supplyApyPercentage: new BigNumber(9.5),
    utilizationRatePercentage: 87,
  },
  {
    borrowApyPercentage: new BigNumber(13.51),
    supplyApyPercentage: new BigNumber(10.56),
    utilizationRatePercentage: 88,
  },
  {
    borrowApyPercentage: new BigNumber(14.76),
    supplyApyPercentage: new BigNumber(11.66),
    utilizationRatePercentage: 89,
  },
  {
    borrowApyPercentage: new BigNumber(16.01),
    supplyApyPercentage: new BigNumber(12.78),
    utilizationRatePercentage: 90,
  },
  {
    borrowApyPercentage: new BigNumber(17.28),
    supplyApyPercentage: new BigNumber(13.94),
    utilizationRatePercentage: 91,
  },
  {
    borrowApyPercentage: new BigNumber(18.56),
    supplyApyPercentage: new BigNumber(15.13),
    utilizationRatePercentage: 92,
  },
  {
    borrowApyPercentage: new BigNumber(19.85),
    supplyApyPercentage: new BigNumber(16.37),
    utilizationRatePercentage: 93,
  },
  {
    borrowApyPercentage: new BigNumber(21.17),
    supplyApyPercentage: new BigNumber(17.64),
    utilizationRatePercentage: 94,
  },
  {
    borrowApyPercentage: new BigNumber(22.49),
    supplyApyPercentage: new BigNumber(18.94),
    utilizationRatePercentage: 95,
  },
  {
    borrowApyPercentage: new BigNumber(23.82),
    supplyApyPercentage: new BigNumber(20.28),
    utilizationRatePercentage: 96,
  },
  {
    borrowApyPercentage: new BigNumber(25.18),
    supplyApyPercentage: new BigNumber(21.66),
    utilizationRatePercentage: 97,
  },
  {
    borrowApyPercentage: new BigNumber(26.55),
    supplyApyPercentage: new BigNumber(23.08),
    utilizationRatePercentage: 98,
  },
  {
    borrowApyPercentage: new BigNumber(27.93),
    supplyApyPercentage: new BigNumber(24.54),
    utilizationRatePercentage: 99,
  },
  {
    borrowApyPercentage: new BigNumber(29.33),
    supplyApyPercentage: new BigNumber(26.04),
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
