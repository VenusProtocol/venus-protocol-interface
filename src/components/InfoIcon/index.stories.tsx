import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { InfoIcon } from '.';

export default {
  title: 'Components/InfoIcon',
  component: InfoIcon,
  decorators: [withCenterStory({ width: 100 })],
} as Meta<typeof InfoIcon>;

export const Default = () => <InfoIcon tooltip="This is a fake tooltip" />;
