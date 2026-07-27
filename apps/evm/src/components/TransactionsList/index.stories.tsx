import type { Meta, StoryObj } from '@storybook/react';

import { transactions } from '__mocks__/models/transactions';
import type { Tx } from 'types';
import { TransactionsList } from '.';

const meta = {
  title: 'Components/TransactionsList',
  component: TransactionsList,
  args: {
    transactions: transactions.transactions as Tx[],
  },
} satisfies Meta<typeof TransactionsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    transactions: [],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
