import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import Filters, { ALL_VALUE } from '.';

export default {
  title: 'Pages/Filters',
  component: Filters,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as Meta<typeof Filters>;

export const Default = () => (
  <Filters
    eventType={ALL_VALUE}
    setEventType={noop}
    showOnlyMyTxns={false}
    setShowOnlyMyTxns={noop}
    walletConnected
  />
);
