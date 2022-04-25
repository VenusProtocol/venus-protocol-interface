import React from 'react';
import noop from 'noop-ts';

import BigNumber from 'bignumber.js';
import { ComponentMeta } from '@storybook/react';
import { TokenId } from 'types';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { SuccessfulTransactionModal } from '.';

export default {
  title: 'Components/SuccessfulTransactionModal',
  component: SuccessfulTransactionModal,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as ComponentMeta<typeof SuccessfulTransactionModal>;

export const InModal = () => (
  <SuccessfulTransactionModal
    isOpened
    handleClose={noop}
    title="Your borrow was successful"
    message="You successfully borrowed"
    transactionHash="0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63"
    amount={{
      valueWei: new BigNumber('100000000000000000000'),
      tokenId: 'xvs' as TokenId,
    }}
  />
);
