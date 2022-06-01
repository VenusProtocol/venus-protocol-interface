import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { HistoryUi } from '.';

export default {
  title: 'Pages/History',
  component: HistoryUi,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof HistoryUi>;

export const Default = () => <HistoryUi />;
