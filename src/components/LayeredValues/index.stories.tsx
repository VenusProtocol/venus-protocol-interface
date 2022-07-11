import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import LayeredValue from '.';

export default {
  title: 'Components/LayeredValue',
  component: LayeredValue,
  decorators: [withCenterStory({ width: 55 })],
} as ComponentMeta<typeof LayeredValue>;

export const Default = () => <LayeredValue topValue="$10,000" bottomValue="12 BNB" />;
