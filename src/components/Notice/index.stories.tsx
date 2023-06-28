import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { Notice } from '.';

export default {
  title: 'Components/Notice',
  component: Notice,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
} as Meta<typeof Notice>;

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
export const Warning = () => (
  <Notice
    variant="warning"
    title="Withdrawal is made using a smart contract"
    description="Сheck with the addressee whether transactions from smart contracts are accepted"
  />
);
