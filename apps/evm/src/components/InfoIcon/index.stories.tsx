import type { Meta } from '@storybook/react';

import { InfoIcon } from '.';

export default {
  title: 'Components/InfoIcon',
  component: InfoIcon,
} as Meta<typeof InfoIcon>;

export const Default = () => <InfoIcon tooltip={'This is a fake tooltip'} />;
