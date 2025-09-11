import type { Meta } from '@storybook/react';

import { Tabs } from '.';

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as Meta<typeof Tabs>;

const tabs = [
  { id: 'borrow', title: 'Borrow', content: <>first tab content</> },
  { id: 'repay', title: 'Repay', content: <>second tab content</> },
];

export const Default = () => <Tabs tabs={tabs} />;
