import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider, withCenterStory } from 'stories/decorators';
import Card, { ILegend } from '.';

export default {
  title: 'Pages/MarketDetail/Card',
  component: Card,
  decorators: [withRouter, withProvider, withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof Card>;

export const Default = () => <Card title="Card title">Children</Card>;

const legends: ILegend[] = [
  {
    label: 'Borrow APY',
    color: 'red',
  },
  {
    label: 'Supply APY',
    color: 'blue',
  },
];

export const WithLegends = () => (
  <Card title="Card title" legends={legends}>
    Children
  </Card>
);
