import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import transactions from '__mocks__/models/transactions';

import { HistoryUi } from '.';
import { ALL_VALUE } from './Filters';

export default {
  title: 'Pages/History',
  component: HistoryUi,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof HistoryUi>;

export const Default = () => (
  <HistoryUi
    eventType={ALL_VALUE}
    setEventType={noop}
    showOnlyMyTxns={false}
    setShowOnlyMyTxns={noop}
    transactions={transactions}
    walletConnected
    isFetching={false}
    limit={20}
    total={60}
    setCurrentPage={noop}
  />
);
