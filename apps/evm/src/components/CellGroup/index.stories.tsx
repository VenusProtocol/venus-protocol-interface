import type { Meta } from '@storybook/react';

import { CellGroup, type CellProps } from '.';

export default {
  title: 'Components/CellGroup',
  component: CellGroup,
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof CellGroup>;

const cells: CellProps[] = [
  {
    label: 'Total supply',
    value: '$1,000,000',
    tooltip: 'This is a fake tooltip',
  },
  {
    label: 'Total borrow',
    value: '$1,000',
    className: 'text-green',
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

export const Small = () => <CellGroup cells={cells} small />;
