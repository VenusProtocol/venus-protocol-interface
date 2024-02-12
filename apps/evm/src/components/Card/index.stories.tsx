import { Meta } from '@storybook/react';

import { withCenterStory } from 'stories/decorators';

import { Card } from '.';

export default {
  title: 'Components/Card',
  component: Card,
  decorators: [withCenterStory({ width: '100%' })],
} as Meta<typeof Card>;

export const Default = () => <Card>Some content</Card>;
