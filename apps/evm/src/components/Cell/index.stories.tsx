import type { Meta } from '@storybook/react';

import { Cell } from '.';

export default {
  title: 'Components/Cell',
  component: Cell,
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof Cell>;

export const Default = () => (
  <Cell label="Total supply" value="$1,000,000" tooltip="This is a fake tooltip" />
);
