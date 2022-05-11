import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Card from '.';

export default {
  title: 'Pages/MarketDetail/Card',
  component: Card,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Card>;

export const Default = () => <Card title="Card title" />;
