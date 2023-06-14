import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { withCenterStory, withOnChange, withThemeProvider } from 'stories/decorators';

import { Toggle } from '.';
import type { ToggleProps } from '.';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  decorators: [
    withCenterStory({ width: 400 }),
    withThemeProvider,
    withOnChange(e => e.target.checked),
  ],
} as Meta<typeof Toggle>;

const Template: StoryFn<ToggleProps> = (args: ToggleProps) => <Toggle {...args} />;

export const Default = Template.bind({});
Default.args = {
  onChange: console.log,
};

export const WithIsLight = Template.bind({});
WithIsLight.args = {
  onChange: console.log,
  isLight: true,
};

export const WithTooltipAndLabel = Template.bind({});
WithTooltipAndLabel.args = {
  onChange: console.log,
  tooltip: 'Fake tooltip',
  label: 'Include XVS distribution APR',
};
