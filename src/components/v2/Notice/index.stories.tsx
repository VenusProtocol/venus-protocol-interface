import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { Notice } from '.';

export default {
  title: 'Components/Notice',
  component: Notice,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
} as ComponentMeta<typeof Notice>;

export const Default = () => (
  <Notice
    title="Withdrawal is made using a smart contract"
    description="Сheck with the addressee whether transactions from smart contracts are accepted"
  />
);
export const Error = () => (
  <Notice
    variant="error"
    description="Сheck with the addressee whether transactions from smart contracts are accepted"
  />
);
export const Success = () => (
  <Notice
    variant="success"
    title="Withdrawal is made using a smart contract"
    description="Сheck with the addressee whether transactions from smart contracts are accepted"
  />
);
