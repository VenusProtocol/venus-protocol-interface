import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider, withCenterStory } from 'stories/decorators';
import Card, { ICardProps } from '.';

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

const legends: ICardProps['legends'] = [
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

const stats: ICardProps['stats'] = [
  {
    label: 'Total supply',
    value: '24M',
  },
  {
    label: 'APY',
    value: '2.65%',
  },
  {
    label: 'Distribution APY',
    value: '1.17%',
  },
];

export const WithStats = () => (
  <Card title="Card title" stats={stats}>
    Children
  </Card>
);
