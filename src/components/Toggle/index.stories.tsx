import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { withCenterStory, withOnChange, withThemeProvider } from 'stories/decorators';

import { Toggle } from '.';
import type { ToggleProps } from '.';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  decorators: [
    withCenterStory({ width: 200 }),
    withThemeProvider,
    withOnChange(e => e.target.checked),
  ],
} as ComponentMeta<typeof Toggle>;

const Template: Story<ToggleProps> = (args: ToggleProps) => <Toggle {...args} />;

export const ToggleOn = Template.bind({});
ToggleOn.args = {
  onChange: console.log,
  value: true,
};

export const ToggleOff = Template.bind({});
ToggleOff.args = {
  onChange: console.log,
  value: false,
};
