import type { Meta } from '@storybook/react';

import LayeredValue from '.';

export default {
  title: 'Components/LayeredValue',
  component: LayeredValue,
} as Meta<typeof LayeredValue>;

export const Default = () => <LayeredValue topValue="$10,000" bottomValue="12 BNB" />;
