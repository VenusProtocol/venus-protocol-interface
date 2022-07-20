import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { withCenterStory, withOnChange } from 'stories/decorators';

import { Select, SelectProps } from '.';

export default {
  title: 'Components/Select',
  component: Select,
  decorators: [withCenterStory({ width: 200 }), withOnChange(e => e.target.value)],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof Select>;

const Template: Story<SelectProps> = (args: SelectProps) => <Select {...args} />;

const options = Array.from(Array(5).keys()).map(i => ({
  value: `value${i}`,
  label: `Value${i}`,
}));

export const Default = Template.bind({});
Default.args = {
  options,
  onChange: console.log,
  value: 'value1',
  ariaLabel: 'select',
  title: 'Select option',
};
