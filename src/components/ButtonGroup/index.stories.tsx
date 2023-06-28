import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { ButtonGroup } from '.';

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  decorators: [withCenterStory({ width: 650 })],
} as Meta<typeof ButtonGroup>;

export const Default = () => (
  <ButtonGroup
    buttonLabels={['Button 1', 'Button 2']}
    onButtonClick={console.log}
    activeButtonIndex={0}
  />
);

export const WithFullWidth = () => (
  <ButtonGroup
    buttonLabels={['Button 1', 'Button 2']}
    onButtonClick={console.log}
    activeButtonIndex={0}
    fullWidth
  />
);
