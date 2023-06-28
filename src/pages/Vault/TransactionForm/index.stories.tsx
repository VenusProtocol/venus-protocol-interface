import { Meta, StoryFn } from '@storybook/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import TransactionForm, { TransactionFormProps } from '.';

export default {
  title: 'Pages/Vault/TransactionForm',
  component: TransactionForm,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof TransactionForm>;

const Template: StoryFn<TransactionFormProps> = args => <TransactionForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  token: TOKENS.vai,
  availableTokensWei: new BigNumber('193871256231321312312'),
  availableTokensLabel: 'Available VAI',
  submitButtonLabel: 'Stake',
  submitButtonDisabledLabel: 'Enter a valid amount to stake',
};

export const WithLockingPeriod = Template.bind({});
WithLockingPeriod.args = {
  token: TOKENS.xvs,
  availableTokensWei: new BigNumber('193871256231321312312'),
  availableTokensLabel: 'Available reward',
  submitButtonLabel: 'Make a request',
  submitButtonDisabledLabel: 'Enter a valid amount to make a request',
  lockingPeriodMs: 10800000000,
};
