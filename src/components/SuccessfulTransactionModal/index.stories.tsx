import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import { TOKENS } from 'constants/tokens';
import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { SuccessfulTransactionModal } from '.';

export default {
  title: 'Components/SuccessfulTransactionModal',
  component: SuccessfulTransactionModal,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as Meta<typeof SuccessfulTransactionModal>;

export const InModal = () => (
  <SuccessfulTransactionModal
    isOpen
    handleClose={noop}
    title="Your borrow was successful"
    content="You successfully borrowed"
    transactionHash="0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63"
    amount={{
      valueWei: new BigNumber('100000000000000000000'),
      token: TOKENS.xvs,
    }}
  />
);

export const WithChildrenNoMessageModal = () => (
  <SuccessfulTransactionModal
    isOpen
    handleClose={noop}
    title="Your borrow was successful"
    transactionHash="0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63"
    content={<div>Custom Content</div>}
  />
);
