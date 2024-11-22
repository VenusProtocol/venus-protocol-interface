import type { Meta } from '@storybook/react';

import { Card } from '.';

export default {
  title: 'Components/Card',
  component: Card,
} as Meta<typeof Card>;

export const Default = () => <Card>Some content</Card>;
