import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withRouter } from 'stories/decorators';

import { Cell, CellGroup } from '.';

export default {
  title: 'Components/CellGroup',
  component: CellGroup,
  decorators: [withRouter, withCenterStory({ width: '100%' })],
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
