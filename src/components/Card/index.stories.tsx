import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withRouter } from 'stories/decorators';

import Card from '.';

export default {
  title: 'Components/Card',
  component: Card,
  decorators: [withRouter, withCenterStory({ width: '100%' })],
} as Meta<typeof Card>;

export const Default = () => <Card>Some content</Card>;
