import React from 'react';
import noop from 'lodash';
import { ComponentMeta } from '@storybook/react';
import Filters, { ALL_VALUE } from '.';

export default {
  title: 'Pages/Filters',
  component: Filters,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof Filters>;

export const Default = () => (
  <Filters
    eventType={ALL_VALUE}
    setEventType={noop}
    showOnlyMyTxns={false}
    setShowOnlyMyTxns={noop}
    walletConnected
  />
);
