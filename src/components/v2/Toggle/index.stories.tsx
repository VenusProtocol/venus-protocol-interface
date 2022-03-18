import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withThemeProvider, withState } from 'stories/decorators';
import { Toggle } from '.';
import type { IToggleProps } from '.';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  decorators: [withCenterStory({ width: 200 }), withThemeProvider, withState],
} as ComponentMeta<typeof Toggle>;

const Template: Story<IToggleProps> = (args: IToggleProps) => <Toggle {...args} />;

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
