import React from 'react';
import BigNumber from 'bignumber.js';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import TransactionForm, { ITransactionFormProps } from '.';

export default {
  title: 'Pages/Vault/TransactionForm',
  component: TransactionForm,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof TransactionForm>;

const Template: Story<ITransactionFormProps> = args => <TransactionForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  tokenId: 'vai',
  availableTokensWei: new BigNumber('193871256231321312312'),
  availableTokensLabel: 'Available VAI',
  submitButtonLabel: 'Stake',
  submitButtonDisabledLabel: 'Enter a valid amount to stake',
};

export const WithLockingPeriod = Template.bind({});
WithLockingPeriod.args = {
  tokenId: 'xvs',
  availableTokensWei: new BigNumber('193871256231321312312'),
  availableTokensLabel: 'Available reward',
  submitButtonLabel: 'Make a request',
  submitButtonDisabledLabel: 'Enter a valid amount to make a request',
  lockingPeriodMs: 10800000000,
};
