import type { Meta } from '@storybook/react';

import { type Cell, CellGroup } from '.';

export default {
  title: 'Components/CellGroup',
  component: CellGroup,
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof CellGroup>;

const cells: Cell[] = [
  {
    label: 'Total supply',
    value: '$1,000,000',
    tooltip: 'This is a fake tooltip',
  },
  {
    label: 'Total borrow',
    value: '$1,000',
    color: 'green',
  },
  {
    label: 'Available Liquidity',
    value: '$999,000',
  },
  {
    label: 'Total treasury',
    value: '$1,000',
  },
];

export const Default = () => <CellGroup cells={cells} />;

export const WithSmallValues = () => <CellGroup cells={cells} smallValues />;
