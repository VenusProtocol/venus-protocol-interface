import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Select } from '.';

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    variant: {
      options: ['primary'],
      control: { type: 'radio' },
    },
  },
} as Meta<typeof Select>;

type Story = StoryObj<typeof Select>;

const options = Array.from(Array(5).keys()).map(i => ({
  value: `value${i}`,
  label: `Value${i}`,
}));

export const Default: Story = {
  args: {
    variant: 'primary',
  },
  render: args => {
    const [value, setValue] = useState<string | number>('value1');
    return <Select {...args} value={value} onChange={setValue} options={options} />;
  },
};

export const Label: Story = {
  render: args => {
    const [value, setValue] = useState<string | number>('value1');
    return (
      <Select {...args} value={value} onChange={setValue} options={options} label="Filter by:" />
    );
  },
};

export const LeftLabel: Story = {
  render: args => {
    const [value, setValue] = useState<string | number>('value1');
    return (
      <Select
        {...args}
        value={value}
        onChange={setValue}
        options={options}
        label="Filter by:"
        placeLabelToLeft
      />
    );
  },
};
