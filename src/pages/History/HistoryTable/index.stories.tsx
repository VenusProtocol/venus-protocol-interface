import { Meta } from '@storybook/react';

import transactions from '__mocks__/models/transactions';

import { HistoryTableUi } from '.';

export default {
  title: 'Pages/History/Table',
  component: HistoryTableUi,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as Meta<typeof HistoryTableUi>;

export const Default = () => <HistoryTableUi transactions={transactions} isFetching={false} />;
