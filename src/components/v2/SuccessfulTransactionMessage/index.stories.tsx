import React from 'react';

import BigNumber from 'bignumber.js';
import { ComponentMeta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { SuccessfulTransactionMessage } from '.';

export default {
  title: 'Components/SuccessfulTransactionMessage',
  component: SuccessfulTransactionMessage,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as ComponentMeta<typeof SuccessfulTransactionMessage>;

export const Default = () => (
  <SuccessfulTransactionMessage
    title="Your borrow was successful"
    message="Your transaction was successful"
    transactionHash="0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63"
  />
);

export const WithAmount = () => (
  <SuccessfulTransactionMessage
    title="Your borrow was successful"
    message="You successfully borrowed"
    transactionHash="0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63"
    amount={{
      valueWei: new BigNumber('100000000000000000000'),
      tokenSymbol: 'xvs',
    }}
  />
);
