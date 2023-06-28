import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import LayeredValue from '.';

export default {
  title: 'Components/LayeredValue',
  component: LayeredValue,
  decorators: [withCenterStory({ width: 55 })],
} as Meta<typeof LayeredValue>;

export const Default = () => <LayeredValue topValue="$10,000" bottomValue="12 BNB" />;
