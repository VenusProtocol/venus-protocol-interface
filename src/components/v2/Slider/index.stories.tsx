import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { Slider } from '.';

export default {
  title: 'Components/Slider',
  component: Slider,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof Slider>;

export const ValidDropdown = () => (
  <Slider
    onChange={console.log}
    defaultValue={50}
    step={10}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
  />
);

export const InValidDropdown = () => (
  <Slider
    onChange={console.log}
    defaultValue={90}
    step={10}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
  />
);
